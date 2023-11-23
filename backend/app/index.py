from flask import Flask, jsonify, request, redirect, make_response, abort
from flask_cors import CORS
from werkzeug.exceptions import HTTPException
from dotenv import load_dotenv
import os
from requests import get, post
import json
from geopy.distance import geodesic
from datetime import datetime
import cProfile
import pstats
import redis
import uuid
import threading

# def normalise_date(ugly_date):
#     return datetime.strptime(ugly_date, "%Y-%m-%d").strftime("%d/%m/%Y")


def get_airport_list(latitude, longitude, max_radius, min_radius=0):
    def distance_calculator(item):
        ## item[0] = IATA code, item[1] = latitude, item[2] = longitude
        distance = geodesic((latitude, longitude), (item[1], item[2])).kilometers
        return item[0] if min_radius <= distance <= max_radius else None

    result = []
    for item in full_airports_list:
        if len(result) >= 600:
            break
        airport_code = distance_calculator(item)
        if airport_code is not None:
            result.append(airport_code)

    return ",".join(result)


def tequila_query(
    flight_origin,
    flight_destination,
    outbound_date,
    return_date,
    outbound_date_end_range="",
    return_date_end_range="",
    price_limit=None,
):
    if outbound_date_end_range == "":
        outbound_date_end_range = outbound_date
    if return_date_end_range == "":
        return_date_end_range = return_date

    url = f"https://api.tequila.kiwi.com/v2/search"
    headers = {"Content-Type": "application/json", "apikey": TEQUILA_KEY}
    params = {
        "fly_from": flight_origin,
        "fly_to": flight_destination,
        "date_from": outbound_date,
        "date_to": outbound_date_end_range,  # Due to some idiot at Tequila, this cannot be == outbound_date
        "return_from": return_date,
        "return_to": return_date_end_range,
        "ret_from_diff_city": "false",
        # "max_fly_duration": "DUMMY",
        "price_to": price_limit,
        "curr": "EUR",
        "sort": "quality",  # quality or price(default)
        "limit": 300,  # max 1000
    }

    result = get(url, headers=headers, params=params)
    if result.status_code != 200:
        return {
            "error": f"A backend error occurred while processing the request - code {result.status_code}"
        }
    else:
        return result.json()


def tequila_parse(tequila_dict):
    parsed_dict = {}
    for route in tequila_dict["data"]:
        if route["cityTo"] not in parsed_dict:
            parsed_dict[route["cityTo"]] = {}
        if len(parsed_dict[route["cityTo"]]) < 5:
            flights_arr = [{}, {}]
            count_out = 0
            count_ret = 0
            for leg in route["route"]:
                leg_object = {
                    "flyFrom": leg["flyFrom"],
                    "cityFrom": leg["cityFrom"],
                    "flyTo": leg["flyTo"],
                    "cityTo": leg["cityTo"],
                    "local_departure": leg["local_departure"],
                    "airline": leg["airline"],
                    "flight_no": leg["flight_no"],
                    "operating_carrier": leg["operating_carrier"],
                    "operating_flight_no": leg["operating_flight_no"],
                    "return": leg["return"],
                }
                if leg["return"] == 0:
                    count_out += 1
                    flights_arr[0][f"step_{count_out}"] = leg_object
                else:
                    count_ret += 1
                    flights_arr[1][f"step_{count_ret}"] = leg_object

            route_object = {
                "flyFrom": route["flyFrom"],
                "cityFrom": route["cityFrom"],
                "flyTo": route["flyTo"],
                "cityTo": route["cityTo"],
                "local_departure": route["local_departure"],
                "price": route["price"],
                "flights": flights_arr,
                "total_legs": count_out + count_ret,
                "out_legs": count_out,
                "return_legs": count_ret,
                "deep_link": route["deep_link"],
                "img_url": unsplash_fetch(route["cityTo"])
                # "img_url": unsplash_fetch(f"{route['cityTo']}, {route['countryTo']['name']}")
                if parsed_dict[route["cityTo"]] == {}
                else parsed_dict[route["cityTo"]]["option_1"]["img_url"],
            }

            parsed_dict[route["cityTo"]][
                f"option_{(len(parsed_dict[route['cityTo']]) + 1)}"
            ] = route_object

    return parsed_dict


def emissions_flights_list(flights_dict):
    flights_list = []
    for destination in flights_dict:
        for option in flights_dict[destination]:
            for flight in flights_dict[destination][option]["flights"][0]:
                flights_list.append(
                    tim_params_builder(
                        flights_dict[destination][option]["flights"][0][flight]
                    )
                )
            for flight in flights_dict[destination][option]["flights"][1]:
                flights_list.append(
                    tim_params_builder(
                        flights_dict[destination][option]["flights"][1][flight]
                    )
                )

    return {"flights": flights_list}


def tim_params_builder(flight_object):
    return {
        "origin": flight_object["flyFrom"],
        "destination": flight_object["flyTo"],
        # "operatingCarrierCode": flight_object["operating_carrier"]
        # if flight_object["operating_carrier"] != ""
        # else flight_object["airline"],
        "operatingCarrierCode": flight_object["airline"],
        "flightNumber": int(flight_object["operating_flight_no"])
        if flight_object["operating_flight_no"] != ""
        else int(flight_object["flight_no"]),
        "departureDate": {
            "year": flight_object["local_departure"][:4],
            "month": flight_object["local_departure"][5:7],
            "day": flight_object["local_departure"][8:10],
        },
    }


def emissions_fetch(flights_object, flight_class="economy"):
    url = f"https://travelimpactmodel.googleapis.com/v1/flights:computeFlightEmissions?key={TIM_KEY}"
    headers = {"Content-Type": "application/json"}
    params_json = json.dumps(flights_object)

    result = post(url, headers=headers, data=params_json)
    result_json = result.json()
    # print(result_json)

    emissions_results = []
    for flight in result_json["flightEmissions"]:
        # print(flight)
        # if flight.get("emissionsGramsPerPax") == None:
        #     emissions_results.append(0)
        # else:
        #     emissions_results.append(flight["emissionsGramsPerPax"][flight_class])
        emissions_results.append(
            0
            if flight.get("emissionsGramsPerPax") == None
            else flight["emissionsGramsPerPax"][flight_class]
        )

    return emissions_results


def emissions_parse(flights_dict, emissions_results):
    new_flights_dict = {}
    emissions_index = 0
    no_emissions = 0
    removed_destinations = 0

    for destination, options in flights_dict.items():
        new_options = {}
        option_count = 0
        for option_key, option_value in options.items():
            outbound_emissions = 0
            return_emissions = 0
            remove_option = False

            new_option_value = {
                "cityFrom": option_value["cityFrom"],
                "cityTo": option_value["cityTo"],
                "deep_link": option_value["deep_link"],
                "flights": [{}, {}],
                "flyFrom": option_value["flyFrom"],
                "flyTo": option_value["flyTo"],
                "img_url": option_value["img_url"],
                "local_departure": option_value["local_departure"],
                "out_legs": option_value["out_legs"],
                "price": option_value["price"],
                "return_legs": option_value["return_legs"],
                "total_legs": option_value["total_legs"],
                "trip_emissions": None,
            }

            for outbound_flight in option_value["flights"][0]:
                emissions = emissions_results[emissions_index]
                emissions_index += 1
                if emissions == 0:
                    no_emissions += 1
                    remove_option = True
                    break
                else:
                    curr_flight = option_value["flights"][0][outbound_flight]
                    new_option_value["flights"][0][outbound_flight] = {
                        "airline": curr_flight["airline"],
                        "cityFrom": curr_flight["cityFrom"],
                        "cityTo": curr_flight["cityTo"],
                        "flight_no": curr_flight["flight_no"],
                        "flyFrom": curr_flight["flyFrom"],
                        "flyTo": curr_flight["flyTo"],
                        "local_departure": curr_flight["local_departure"],
                        "operating_carrier": curr_flight["operating_carrier"],
                        "operating_flight_no": curr_flight["operating_flight_no"],
                        "return": 0,
                        "flight_emissions": emissions,
                    }
                outbound_emissions += emissions

            if not remove_option:
                for return_flight in option_value["flights"][1]:
                    emissions = emissions_results[emissions_index]
                    emissions_index += 1
                    if emissions == 0:
                        no_emissions += 1
                        remove_option = True
                        break
                    else:
                        curr_flight = option_value["flights"][1][return_flight]
                        new_option_value["flights"][1][return_flight] = {
                            "airline": curr_flight["airline"],
                            "cityFrom": curr_flight["cityFrom"],
                            "cityTo": curr_flight["cityTo"],
                            "flight_no": curr_flight["flight_no"],
                            "flyFrom": curr_flight["flyFrom"],
                            "flyTo": curr_flight["flyTo"],
                            "local_departure": curr_flight["local_departure"],
                            "operating_carrier": curr_flight["operating_carrier"],
                            "operating_flight_no": curr_flight["operating_flight_no"],
                            "return": 1,
                            "flight_emissions": emissions,
                        }
                    return_emissions += emissions

            if not remove_option:
                total_emissions = outbound_emissions + return_emissions
                new_option_value["trip_emissions"] = total_emissions
                option_count += 1
                new_options[f"option_{option_count}"] = new_option_value

        if new_options:
            new_flights_dict[destination] = new_options
        else:
            removed_destinations += 1

    print(f"Flights with no emissions: {no_emissions}")
    print(f"Destinations removed: {removed_destinations}")
    return new_flights_dict


# Can refactor this for sure, probably incorporate this methodology into emissions_parse
def reset_option_numbers(dict):
    output_dict = {}

    for destination, options in dict.items():
        new_options = {}
        count = 1

        for option_key, option_value in options.items():
            new_option_key = f"option_{count}"
            new_options[new_option_key] = option_value
            count += 1

        output_dict[destination] = new_options

    return output_dict


def destinations_sort(results):
    sorted_results = dict(
        sorted(
            results.items(),
            key=lambda item: min(
                option.get("trip_emissions", float("inf"))
                for option in item[1].values()
            ),
        )
    )
    return sorted_results


def unsplash_fetch(query):
    url = f"https://api.unsplash.com/search/photos/"
    headers = {
        "Content-Type": "application/json",
        "Accept-Version": "v1",
        "Authorization": f"Client-ID {UNSPLASH_ACCESS}",
    }
    params = {
        "query": query,
        "orientation": "portrait",
        "per_page": 1,
        "order_by": "relevant",
    }
    result = get(url, headers=headers, params=params).json()
    img_url = result["results"][0]["urls"]["raw"]
    img_url_resized = img_url + "&w=400&h=600&fit=crop&crop=top,bottom,left,right"
    return img_url_resized


def generate_results(id, data):
    print(f"started task {id}")
    # request_id = f"request_{id}"
    # data = json.loads(redis_client.get(request_id))
    user_location = [float(data["latLong"]["lat"]), float(data["latLong"]["long"])]
    trip_length = data["tripLength"]
    radius_range = (
        [1500, 0]
        if trip_length == "trip-short"
        else [4000, 1500]
        if trip_length == "trip-medium"
        else [15000, 4000]
    )
    origin_airports = get_airport_list(*user_location, 100)
    destination_airports = get_airport_list(*user_location, *radius_range)
    # Tequila step
    tequila_result = tequila_query(
        origin_airports,
        destination_airports,
        data["outboundDate"],
        data["returnDate"],
        data["outboundDateEndRange"],
        data["returnDateEndRange"],
        data["price"],
    )
    # Tequila sort step
    processed_data = tequila_parse(tequila_result)
    # Emissions step
    tim_processed_data = emissions_flights_list(processed_data)
    emissions_results = emissions_fetch(tim_processed_data)
    processed_data_with_emissions = emissions_parse(processed_data, emissions_results)
    sorted_result = destinations_sort(processed_data_with_emissions)
    print("backend completed")
    redis_client.set(f"response_{id}", json.dumps(sorted_result))
    print("redis updated")


# Get API key from environment variables
env_path = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", ".env.local")
load_dotenv(dotenv_path=env_path)
FLASK_ENV = os.getenv("FLASK_ENV")
TIM_KEY = os.getenv("TIM_API_KEY")
TEQUILA_KEY = os.getenv("TEQUILA_API_KEY")
UNSPLASH_ACCESS = os.getenv("UNSPLASH_ACCESS_KEY")
UNSPLASH_SECRET_KEY = os.getenv("UNSPLASH_SECRET_KEY")

# current_dir = os.path.dirname(os.path.realpath(__file__))

# # Load all airports
# with open(os.path.join(current_dir, "data", "airports.json"), "r") as json_file:
#     full_airports_list = json.load(json_file)

if FLASK_ENV == "production":
    data_path = os.path.join("./app", "data", "airports.json")
else:
    current_dir = os.path.dirname(os.path.realpath(__file__))
    data_path = os.path.join(current_dir, "data", "airports.json")

# Load all airports
with open(data_path, "r") as json_file:
    full_airports_list = json.load(json_file)

# App instance
app = Flask(__name__)
CORS(app, supports_credentials=True)
redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST"),
    port=os.getenv("REDIS_PORT"),
    db=0,
    password=os.getenv("REDIS_PASS"),
    socket_timeout=60,
)

profile = cProfile.Profile()


# Server wakeup
@app.route("/api/ping", methods=["GET"])
def ping():
    print("I am awake")
    return "<p>I am awake!<p>"


#
@app.route("/processRequest/<string:id>", methods=["GET"])
def process_request(id):
    request_id = f"request_{id}"
    try:
        data = json.loads(redis_client.get(request_id))
    except Exception:
        error_code = "failedGetTask"
        redis_client.set(f"error_{id}", json.dumps(error_code))
        return jsonify(error_code)

    try:
        user_location = [float(data["latLong"]["lat"]), float(data["latLong"]["long"])]
        trip_length = data["tripLength"]
        radius_range = (
            [1500, 0]
            if trip_length == "trip-short"
            else [4000, 1500]
            if trip_length == "trip-medium"
            else [15000, 4000]
        )
    except Exception:
        error_code = "invalidInput"
        redis_client.set(f"error_{id}", json.dumps(error_code))
        return jsonify(error_code)

    try:
        origin_airports = get_airport_list(*user_location, 100)
        destination_airports = get_airport_list(*user_location, *radius_range)
    except Exception:
        error_code = "airports"
        redis_client.set(f"error_{id}", json.dumps(error_code))
        # abort(400)
        return jsonify(error_code)

    # Tequila step
    tequila_result = tequila_query(
        origin_airports,
        destination_airports,
        data["outboundDate"],
        data["returnDate"],
        data["outboundDateEndRange"],
        data["returnDateEndRange"],
        data["price"],
    )
    # Tequila sort step
    processed_data = tequila_parse(tequila_result)
    # Emissions step
    tim_processed_data = emissions_flights_list(processed_data)
    emissions_results = emissions_fetch(tim_processed_data)
    processed_data_with_emissions = emissions_parse(processed_data, emissions_results)
    sorted_result = destinations_sort(processed_data_with_emissions)

    # ############################
    # current_dir = os.path.dirname(os.path.realpath(__file__))
    # print(current_dir)
    # with open(os.path.join(current_dir, "data", "tequila_data.json"), "w") as json_file:
    #     json.dump(tequila_result, json_file, indent=4)
    # with open(os.path.join(current_dir, "data", "parsed_data.json"), "w") as json_file:
    #     json.dump(processed_data, json_file, indent=4)
    # with open(
    #     os.path.join(current_dir, "data", "emissions_request.json"), "w"
    # ) as json_file:
    #     json.dump(tim_processed_data, json_file, indent=4)
    # with open(
    #     os.path.join(current_dir, "data", "parsed_with_emissions.json"), "w"
    # ) as json_file:
    #     json.dump(processed_data_with_emissions, json_file, indent=4)
    # #######################################

    redis_client.set(f"response_{id}", json.dumps(sorted_result))
    redis_client.connection_pool.disconnect()  # Added this to attempt to control number of redis connections

    return jsonify("Processing complete")


# @app.route("/processPostRequest/<string:id>", methods=["POST"])
# def process_request_post(id):
#     request_data = request.json

#     request_id = f"request_{id}"
#     data = json.loads(redis_client.get(request_id))
#     user_location = [float(data["latLong"]["lat"]), float(data["latLong"]["long"])]
#     trip_length = data["tripLength"]
#     radius_range = (
#         [1500, 0]
#         if trip_length == "trip-short"
#         else [4000, 1500]
#         if trip_length == "trip-medium"
#         else [15000, 4000]
#     )
#     origin_airports = get_airport_list(*user_location, 100)
#     destination_airports = get_airport_list(*user_location, *radius_range)
#     # Tequila step
#     tequila_result = tequila_query(
#         origin_airports,
#         destination_airports,
#         data["outboundDate"],
#         data["returnDate"],
#         data["outboundDateEndRange"],
#         data["returnDateEndRange"],
#         data["price"],
#     )
#     # Tequila sort step
#     processed_data = tequila_parse(tequila_result)
#     # Emissions step
#     tim_processed_data = emissions_flights_list(processed_data)
#     emissions_results = emissions_fetch(tim_processed_data)
#     processed_data_with_emissions = emissions_parse(processed_data, emissions_results)
#     sorted_result = destinations_sort(processed_data_with_emissions)

#     redis_client.set(f"response_{id}", json.dumps(sorted_result))

#     return jsonify("Processing complete")


### Errors ###
@app.errorhandler(HTTPException)
def handle_bad_request(e):
    # print(HTTPException.code)
    # print(e.code)
    # redis_client.set(f"error_{id}", json.dumps(e.code))
    return jsonify(f"Error {e.code}")
    # return "bad request!", 400


# Initialise app
if __name__ == "__main__":
    if FLASK_ENV == "production":
        app.run(host="0.0.0.0", port=int(os.environ.get("FLASK_RUN_PORT", 5000)))
    else:
        app.run(debug=True, port=8080)
