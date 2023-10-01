import pandas as pd
import json

url_airports = "https://github.com/davidmegginson/ourairports-data/raw/main/airports.csv"
# url_countries = "https://github.com/davidmegginson/ourairports-data/raw/main/countries.csv"
# url_regions = "https://github.com/davidmegginson/ourairports-data/raw/main/regions.csv"

ignore_na = [] #[""]

airports = pd.read_csv(url_airports, sep=",", na_values=ignore_na, keep_default_na=False)
# countries = pd.read_csv(url_countries, sep=",", na_values=ignore_na, keep_default_na=False)
# regions = pd.read_csv(url_regions, sep=",", na_values=ignore_na, keep_default_na=False)


airports = airports.loc[(airports["type"] == "large_airport") | (airports["type"] == "medium_airport")]
airports = airports.loc[(airports["scheduled_service"] == "yes")]
airports = airports.loc[(airports["iata_code"] != "")]
airports = airports.sort_values(by=["type","iata_code"]) # Sort by large airports first, then alphabetically. This may improve tequila query performance, but we might miss out on some of the smaller airports
airports = airports[['iata_code', 'latitude_deg', 'longitude_deg']]

# print(airports.info())
# print(airports.head(15))

airports_list = airports.values.tolist()

with open("airports.json", "w") as json_file:
    json.dump(airports_list, json_file)