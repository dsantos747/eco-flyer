import pandas as pd
import json

url_airports = (
    "https://github.com/davidmegginson/ourairports-data/raw/main/airports.csv"
)

ignore_na = []  # [""]

airports = pd.read_csv(
    url_airports, sep=",", na_values=ignore_na, keep_default_na=False
)

airports = airports.loc[
    (airports["type"] == "large_airport") | (airports["type"] == "medium_airport")
]
airports = airports.loc[(airports["scheduled_service"] == "yes")]
airports = airports.loc[(airports["iata_code"] != "")]
airports = airports.sort_values(by=["type", "iata_code"])
airports = airports[["iata_code", "latitude_deg", "longitude_deg"]]

airports_list = airports.values.tolist()

with open("../app/data/airports.json", "w") as json_file:
    json.dump(airports_list, json_file)
