package ecoflyer

import (
	"encoding/json"
	"fmt"
	"os"

	geodesic "github.com/tidwall/geodesic"
)

//
//
//
//
// WRITE UP A SIMPLE MAIN() AND TEST THIS!
//
//
//
//
//

func getAirportsInRange(latitude, longitude float32, maxRadius, minRadius int) (*[500]string, error) {
	checkInRange := func(a Airport) bool {
		var distance float64
		geodesic.WGS84.Inverse(float64(latitude), float64(longitude), float64(a.Lat), float64(a.Lon), &distance, nil, nil)
		distance *= 0.001
		return float64(minRadius) <= distance && distance <= float64(maxRadius)
	}
	var res [500]string // ! If less than two airports are found, remaining entries will be ""
	var i int
	var inRange bool

	file, err := os.Open("./data/airports.json")
	if err != nil {
		fmt.Printf("failed to load airports.json: %v\n", err)
		return nil, err
	}
	defer file.Close()

	var airports []Airport
	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&airports); err != nil {
		fmt.Printf("failed to decode airports.json: %v\n", err)
		return nil, err
	}

	for _, airport := range airports {
		inRange = checkInRange(airport)
		if inRange {
			res[i] = airport.Code
			i++
		}
		if i >= 600 {
			break
		}
	}

	return &res, nil
}

func getTequilaResults(origin, destination, outDateStart, returnDateStart string, outDateEnd, returnDateEnd *string, priceLimit int) (*[][]TequilaItinerary, error) {

	if outDateEnd == nil {
		outDateEnd = &outDateStart
	}
	if returnDateEnd == nil {
		returnDateEnd = &returnDateStart
	}

	url := "https://api.tequila.kiwi.com/v2/search"
	headers := map[string]string{"Content-Type": "application/json", "apikey": os.Getenv("TEQUILA_KEY")} // TODO: REPLACE WITH WRAPPED ENV CHECK, to handle all environments
	params := map[string]string{
		"fly_from":           origin,
		"fly_to":             destination,
		"date_from":          outDateStart,
		"date_to":            *outDateEnd,
		"return_from":        returnDateStart,
		"return_to":          *returnDateEnd,
		"ret_from_diff_city": "false",
		"price_to":           fmt.Sprintf("%d", priceLimit),
		"curr":               "EUR",
		"sort":               "quality",
		"limit":              fmt.Sprintf("%d", 400),
	}

	response, err := MakeHTTPRequest("GET", url, nil, params, headers)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	if response.StatusCode != 200 {
		// TODO: in main function, return this as http error
		return nil, fmt.Errorf("error getting tequila results: %s", response.Status)
	}

	var result RawTequilaResponse
	err = json.NewDecoder(response.Body).Decode(&result)
	if err != nil {
		err = fmt.Errorf("error decoding json: %w", err)
		return nil, err
	}

	parsedResult := parseTequilaResponse(result)

	return &parsedResult, nil
}

func parseTequilaResponse(raw RawTequilaResponse) [][]TequilaItinerary {
	// In python we used a map, but in go maps are unordered, so we might need to use a slice...
	parsedData := [][]TequilaItinerary{} // This is a slice of destinations, each containing a slice of itineraries
	foundDests := map[string]int{}
	unsplashCache := map[string]string{}
	it := TequilaItinerary{} // Will this override the map in memory? As in, in the parsedData?
	for _, itin := range raw.Data {
		if foundDests[itin.CityTo] > 4 {
			continue
		}

		// Parse the overall itinerary
		it.CityTo, it.CityFrom, it.FlyTo, it.FlyFrom, it.LocalDeparture, it.Price, it.DeepLink = itin.CityTo, itin.CityFrom, itin.FlyTo, itin.FlyFrom, itin.LocalDeparture, itin.Price, itin.DeepLink

		// Parse the legs
		legs := [2]map[string]Leg{}
		newLeg := Leg{}
		count_out, count_ret := 0, 0
		for _, leg := range itin.Route {
			newLeg.CityTo, newLeg.CityFrom, newLeg.FlyTo, newLeg.FlyFrom, newLeg.LocalDeparture, newLeg.Airline, newLeg.FlightNo, newLeg.OperatingCarrier, newLeg.OperatingFlightNo, newLeg.Return = leg.CityTo, leg.CityFrom, leg.FlyTo, leg.FlyFrom, leg.LocalDeparture, leg.Airline, leg.FlightNo, leg.OperatingCarrier, leg.OperatingFlightNo, leg.Return

			if leg.Return == 0 {
				count_out++
				legs[0][fmt.Sprintf("step_%d", count_out)] = newLeg
			} else {
				count_ret++
				legs[1][fmt.Sprintf("step_%d", count_ret)] = newLeg
			}
		}

		// Add the additional calculated fields
		it.TotalLegs = count_out + count_ret
		it.OutLegs = count_out
		it.RetLegs = count_ret

		if img, ok := unsplashCache[it.CityTo]; ok {
			it.ImgUrl = img
		} else {
			// fetch unsplash here
			imgUrl := "A FAKE URL"
			unsplashCache[it.CityTo] = imgUrl
		}

		// Need to search through slice to find correct subslice of destinations to append to.
		// If destination not found, append as new destination in slice
		if _, ok := foundDests[itin.CityTo]; !ok {
			parsedData = append(parsedData, []TequilaItinerary{it})
			foundDests[itin.CityTo] = 0 // Is this necessary?
		} else {
			for i, dest := range parsedData {
				if dest[0].CityTo == it.CityTo {
					parsedData[i] = append(parsedData[i], it)
				}
			}
		}

		foundDests[itin.CityTo]++

	}

	return parsedData
}
