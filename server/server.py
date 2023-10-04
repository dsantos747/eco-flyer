from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
from requests import get, post
import json
import numpy as np
from geopy.distance import geodesic

### Function to get a list of locations based on user's departure location and distance
##### Maybe use a different API? There should be a free one
####### MAYBE DO THIS IN NEXT
def get_airport_list(latitude,longitude,radius):
    def distance_calculator(item):
        ## item[0] = IATA code, item[1] = latitude, item[2] = longitude
        distance = geodesic((latitude,longitude),(item[1],item[2])).kilometers # Calculate airport distance from user
        return item[0] if distance <= radius else None # Return airport code if distance from user is less than radius

    result = list(filter(None, map(distance_calculator, full_airports_list))) 

    return(result)

### Function to query KIWI api based on user preferences
##### Input:
def tequila_query(flight_origin,flight_destination):

    url = f"https://api.tequila.kiwi.com/v2/search"
    headers = {
        "Content-Type": "application/json",
        "apikey": TEQUILA_KEY
    }
    params= {"fly_from": flight_origin,
             "fly_to": flight_destination, #If this is left out you get "aggregated results for destination airports relevant to the departure location"
             "date_from": "DUMMY",
             "date_to": "DUMMY",
             "return_from": "DUMMY",
             "return_to": "DUMMY",
             "max_fly_duration": "DUMMY", #Use this to set bands of how far to travel. MIGHT NOT BE NECESSARY if destination list is precomputed above
             "price_to": "DUMMY", #might be useful to control the results a bit.
             "curr": "DUMMY",
             "sort": "DUMMY", # quality or price(default)
             "limit": 200} #max 1000, 200 default


    # result = get(url, headers=headers, data=params)
    return "tequila_query"

### Function to parse data from KIWI api
#-- Will need to filter through results with the following strategy:
#----- Results should be outputted from previous function sorted by quality
#----- Only up to X (maybe 3?) alternatives should be maintained for each destination
#----- Subobjects of destinations should be created, as below. This allows us to calculate the emissions for each destination
#----- and present the minimum one, but also provide some backup dates.
#
#-- This function acts as a pre-sort, to which we then add emissions data, and then we can present all info to user.
def tequila_parse(tequila_dict):
    parsed_dict = {}
    # route_length_list = [0] * len(tequila_dict["data"])
    # route_index = 0
    for route in tequila_dict["data"]: # TASK: Replace this with map(), for performance?
        if route["cityTo"] not in parsed_dict: # Check if no entry exists yet for this destination, add if so
            parsed_dict[route["cityTo"]] = []
        if len(parsed_dict[route["cityTo"]]) < 3: # Only add entry if less than 3 entries exist for this destination
            # Add all relevant info to an object.
            flights_arr = [[],[]]
            count_out = 0
            for leg in route["route"]: # TASK: Replace this with map(), for performance?
                leg_object = {
                    "id": leg["id"],
                    "combination_id": leg["combination_id"],
                    "flyFrom": leg["flyFrom"],
                    "cityFrom": leg["cityFrom"],
                    "flyTo": leg["flyTo"],
                    "cityTo": leg["cityTo"],
                    "local_departure": leg["local_departure"],
                    "utc_departure": leg["utc_departure"],
                    "local_arrival": leg["local_arrival"],
                    "utc_arrival": leg["utc_arrival"],
                    "airline": leg["airline"],
                    "flight_no": leg["flight_no"],
                    "operating_carrier": leg["operating_carrier"],
                    "operating_flight_no": leg["operating_flight_no"],
                    "return": leg["return"],
                }
                if leg["return"] == 0:
                    flights_arr[0].append(leg_object)
                    count_out += 1
                else:
                    flights_arr[1].append(leg_object)

            route_object = {
                "id": route["id"],
                "flyFrom": route["flyFrom"],
                "cityFrom": route["cityFrom"],
                # "cityCodeFrom": route["cityCodeFrom"],
                "flyTo": route["flyTo"],
                "cityTo": route["cityTo"],
                # "cityCodeTo": route["cityCodeTo"],
                "countryFrom": route["countryFrom"]["name"],
                "countryTo": route["countryTo"]["name"],
                "local_departure": route["local_departure"],
                "utc_departure": route["utc_departure"],
                "local_arrival": route["local_arrival"],
                "utc_arrival": route["utc_arrival"],
                "nightsInDest": route["nightsInDest"],
                "quality": route["quality"],
                "distance": route["distance"],
                "duration": {"departure": route["duration"]["departure"],"return": route["duration"]["return"],"total": route["duration"]["total"]},
                "price": route["price"],
                "airlines": route["airlines"],
                "flights": flights_arr,
                "total_legs": len(route["route"]), # Use this to know the total amount of flights in a booking
                "out_legs": count_out, # Use this to know the outbound amount of flights in a booking
                "return_legs": len(route["route"])-count_out, # Use this to know the return amount of flights in a booking
                "booking_token": route["booking_token"],
                "deep_link": route["deep_link"]
            }
            # Append it to the array for this destination
            parsed_dict[route["cityTo"]].append(route_object)
    
    return parsed_dict

### Function to prepare an array of flights for inputting to emissions_fetch
##### Input: dictionary (as output from tequila_parse)
def emissions_flights_list(flights_dict):
    flights_list = []
    for destination in flights_dict:
        for option in flights_dict[destination]:
            flights_list.append(list(map(tim_params_builder,option["flights"][0]))) # FIX: This is not accounting for when there are multiple flights in a direction - if you see the json output you'll see that flights are grouped into subarrays. Doesn't seem to be causing errors with getting emissions though.
            flights_list.append(list(map(tim_params_builder,option["flights"][1])))
    return {"flights": flights_list}

def tim_params_builder(flight_object):
    return {
        "origin": flight_object["flyFrom"],
        "destination": flight_object["flyTo"],
        # "operatingCarrierCode": flight_object["airline"], ### FIX: May need to check if operating carrier is preferred over airline or not
        # "flightNumber": int(flight_object["flight_no"]), ### FIX: May need to check if operating flight no is preferred over flight no or not
        "operatingCarrierCode": flight_object["operating_carrier"] if flight_object["operating_carrier"] != "" else flight_object["airline"], ### FIX: May need to check if operating carrier is preferred over airline or not
        "flightNumber": int(flight_object["operating_flight_no"]) if flight_object["operating_flight_no"] != "" else int(flight_object["flight_no"]), ### FIX: May need to check if operating flight no is preferred over flight no or not
        "departureDate": {"year": flight_object["local_departure"][:4], "month": flight_object["local_departure"][5:7], "day": flight_object["local_departure"][8:10]}
    }

### Function to calculate emissions from an array of flights
def emissions_fetch(flights_object,flight_class="economy"):

    url = f"https://travelimpactmodel.googleapis.com/v1/flights:computeFlightEmissions?key={TIM_KEY}"
    headers = {
        "Content-Type": "application/json"
    }
    params_json = json.dumps(flights_object)

    result = post(url, headers=headers, data=params_json)
    result_json = result.json()

    emissions_results = []
    for flight in result_json["flightEmissions"]:
        emissions_results.append(0 if flight.get('emissionsGramsPerPax') == None else flight['emissionsGramsPerPax'][flight_class])

    # emissions_results = []
    # for flight in result_json["flightEmissions"]: ### Add a method to sort results by emissions
    #     flight_carrier = flight['flight']['operatingCarrierCode']
    #     flight_number = flight['flight']['flightNumber']
    #     flight_destination = flight['flight']['destination']
    #     flight_emissions = "Unknown" if flight.get('emissionsGramsPerPax') == None else f"{flight['emissionsGramsPerPax'][flight_class]}g"
    #     flight_object = f"Flight {flight_carrier}{flight_number} to {flight_destination} - {flight_emissions} emissions per person."
    #     emissions_results.append(flight_object)
    
    return emissions_results

### Function to add emissions_results to tequila_parse output
def emissions_parse(flights_dict,emissions_results):
    for destination in flights_dict:
        for option in flights_dict[destination]:
            outbound_emissions=0
            for outbound_flights in option["flights"][0]:
                emissions = emissions_results.pop(0)
                if emissions == 0:
                    # print(f"no emissions data for flight to {outbound_flights['flyTo']}") # do something here
                    outbound_flights["flight_emissions"] = emissions # CURRENTLY ADDING 0 EMISSIONS TO FILE - WILL NEED TO FIX THIS
                else:
                    outbound_flights["flight_emissions"] = emissions
                outbound_emissions += emissions
            # print(f"total outbound leg emissions = {outbound_emissions}")
            
            return_emissions=0
            for return_flights in option["flights"][1]:
                emissions = emissions_results.pop(0)
                if emissions == 0:
                    # print("no emissions data") # do something here
                    return_flights["flight_emissions"] = emissions # CURRENTLY ADDING 0 EMISSIONS TO FILE - WILL NEED TO FIX THIS
                else:
                    return_flights["flight_emissions"] = emissions
                return_emissions += emissions
            # print(f"total return leg emissions = {return_emissions}")
            
            total_emissions = outbound_emissions + return_emissions
            option["trip_emissions"] = total_emissions
            # print(f"total trip emissions = {total_emissions}")
        # print("next destination")

    return flights_dict

def results_sort(results):
    sorted_results = dict(sorted(results.items(), key=lambda item: item[1][0]['trip_emissions']))
    return sorted_results


### Function to generate KIWI api result for user booking
##### Input: a list of flight options, as returned by emissions_fetch:


current_dir = os.path.dirname(os.path.realpath(__file__))

# Get API key from environment variables
load_dotenv()
TIM_KEY = os.getenv("TIM_API_KEY")
TEQUILA_KEY = os.getenv("TEQUILA_API_KEY")
RAPID_API_KEY = os.getenv("RAPID_API_KEY")

# Load all airports
with open(os.path.join(current_dir, "data", "airports.json"), "r") as json_file:
    full_airports_list = json.load(json_file)

# App instance
app = Flask(__name__)
CORS(app)

##### TEST - Dummy variables section
# user_location = (38.7813, -9.13592)
# search_radius = 1500 # km

##### TEST airport list fetching
# origin_airports = get_airport_list(*user_location, 100) # List of airports in a 100km radius from user's location ### FIX: Change this to a single value?
# destination_airports = get_airport_list(*user_location, search_radius)


##### TEST read data from tequila response, filter and create flights list for emissions testing
with open(os.path.join(current_dir, "data", "test_tequila_response.json"), 'r', encoding="utf-8") as file:
    json_data = json.load(file)

# processed_data = tequila_parse(json_data)

# with open(os.path.join(current_dir, "data", "processed_tequila_data.json"), 'w') as file:
#     json.dump(processed_data, file, indent=2)

# tim_processed_data = emissions_flights_list(processed_data)

# with open(os.path.join(current_dir, "data", "prepped_TIM_list.json"), 'w') as file:
#     json.dump(tim_processed_data, file, indent=2)

##### TEST emissions checking

# emissions_results = emissions_fetch(tim_processed_data)

# with open(os.path.join(current_dir, "data", "emissions_results_list.json"), 'w') as file:
#     json.dump(emissions_results, file, indent=2) 

##### TEST emissions parsing

# processed_data_with_emissions = emissions_parse(processed_data,emissions_results)

# with open(os.path.join(current_dir, "data", "processed_data_with_emissions.json"), 'w') as file:
#     json.dump(processed_data_with_emissions, file, indent=2) 



##### TEST individual manual emissions check
# test_flight = {
#     "flights": [
#         {
#         "origin": "PMI",
#         "destination": "BCN",
#         "operatingCarrierCode": "FR",
#         "flightNumber": 3071,
#         "departureDate": {
#           "year": "2024",
#           "month": "04",
#           "day": "03"
#         }
#       }
#     ]
# }
# print(emissions_fetch(test_flight))


# App route to return simple JSON message
@app.route("/api/home", methods=["GET"])
def return_home():
    return jsonify({
        "message": "Hello this world"
    })

# App route to run request to Travel Impact Model API
@app.route("/api/emissions", methods=["GET"])
def emissions_route():

    # Add additional client-side filters for tequila API here
    user_location = tuple(map(float, request.args.get("loc").split(',')))
    search_radius = int(request.args.get("rad"))
    origin_airports = get_airport_list(*user_location, 100) # List of airports in a 100km radius from user's location ### FIX: Change this to a single value?
    destination_airports = get_airport_list(*user_location, search_radius)

    ### Add tequila api call here
    processed_data = tequila_parse(json_data)
    tim_processed_data = emissions_flights_list(processed_data)
    emissions_results = emissions_fetch(tim_processed_data)
    processed_data_with_emissions = emissions_parse(processed_data,emissions_results)
    sorted_result = results_sort(processed_data_with_emissions)
    return jsonify(sorted_result)
    

# Initialise app
if __name__ == "__main__":
    app.run(debug=True, port=8080)