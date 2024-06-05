package main

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"time"

	geodesic "github.com/tidwall/geodesic"
)

func getAirportsInRange(latitude, longitude float32, maxRadius, minRadius int) (*[]string, error) {
	checkInRange := func(a Airport) bool {
		var distance float64
		geodesic.WGS84.Inverse(float64(latitude), float64(longitude), float64(a.Lat), float64(a.Lon), &distance, nil, nil)
		distance *= 0.001
		return float64(minRadius) <= distance && distance <= float64(maxRadius)
	}
	var res []string // ! If less than two airports are found, remaining entries will be ""
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
			res = append(res, airport.Code)
			i++
		}
		if i >= 500 {
			break
		}
	}

	return &res, nil
}

func sliceToString(slice []string) string {
	stringSlice := ""

	for _, s := range slice {
		stringSlice += fmt.Sprintf("%s,", s)
	}

	return stringSlice[:len(stringSlice)-1]
}

func getTequilaResults(origin, destination []string, outDateStart, returnDateStart string, outDateEnd, returnDateEnd *string, priceLimit int) (*[][]TequilaItinerary, error) {

	if outDateEnd == nil {
		outDateEnd = &outDateStart
	}
	if returnDateEnd == nil {
		returnDateEnd = &returnDateStart
	}

	url := "https://api.tequila.kiwi.com/v2/search"
	headers := map[string]string{"Content-Type": "application/json", "apikey": os.Getenv("TEQUILA_API_KEY")}
	params := map[string]string{
		"fly_from":           sliceToString(origin),
		"fly_to":             sliceToString(destination),
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

	start := time.Now()
	response, err := MakeHTTPRequest("GET", url, nil, params, headers) // The problem is, the tequila api is shitty af and has horrible response times
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()
	fmt.Println("Response time from tequila api:", time.Since(start))

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
		legs := [2]map[string]Leg{make(map[string]Leg), make(map[string]Leg)}
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
			imgUrl, err := fetchUnsplash(it.CityTo)
			if err != nil {
				// Should probably handle this better
				fmt.Println("Error fetching image from unsplash:", err)
			} else {
				unsplashCache[it.CityTo] = *imgUrl
			}
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

func fetchUnsplash(query string) (*string, error) {
	url := "https://api.unsplash.com/search/photos/"
	headers := map[string]string{
		"Content-Type":   "application/json",
		"Accept-Version": "v1",
		"Authorization":  fmt.Sprintf("Client-ID %s", os.Getenv("UNSPLASH_ACCESS_KEY")),
	}
	params := map[string]string{
		"query":       query,
		"orientation": "portrait",
		"per_page":    "1",
		"order_by":    "relevant",
	}

	start := time.Now()
	response, err := MakeHTTPRequest("GET", url, nil, params, headers)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()
	fmt.Println("Response time from Unsplash:", time.Since(start))

	body, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}
	result := UnsplashResponse{}
	err = json.Unmarshal(body, &result)
	if err != nil {
		return nil, err
	}
	imgUrl := result.Results[0].Urls["raw"]
	resizedImgUrl := imgUrl + "&w=400&h=600&fit=crop&crop=top,bottom,left,right"

	return &resizedImgUrl, nil
}

func main() {

	start := time.Now()

	err := LoadEnv()
	if err != nil {
		fmt.Printf("Could not load environment variables from .env file: %v\n", err)
		return
	}

	t1 := time.Since(start)

	departAirports, err := getAirportsInRange(38.683333, -9.333333, 100, 0)
	if err != nil {
		fmt.Println("error getting depart airports", err)
	}
	t2 := time.Since(start) - t1
	destAirports, err := getAirportsInRange(38.683333, -9.333333, 1500, 200)
	if err != nil {
		fmt.Println("error getting destination airports", err)
	}
	t3 := time.Since(start) - t2

	dateFrom := "01/01/2025"
	dateTo := "01/03/2025"

	itineraries, err := getTequilaResults(*departAirports, *destAirports, dateFrom, dateTo, nil, nil, 1000)
	if err != nil {
		fmt.Printf("error getting tequila results: %v\n", err)
	}
	t4 := time.Since(start) - t3

	itineraries = &[][]TequilaItinerary{}
	fmt.Println(itineraries)

	fmt.Println("Time to load env vars:", t1)
	fmt.Println("Time to get depart airports:", t2)
	fmt.Println("Time to get destination airports:", t3)
	fmt.Println("Time to get tequila results:", t4)

}
