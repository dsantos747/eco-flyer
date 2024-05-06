package ecoflyer

import (
	"encoding/json"
	"fmt"
	"os"

	geodesic "github.com/tidwall/geodesic"
)

type airport struct {
	code     string
	lat, lon float32
}

func getairportList(latitude, longitude float32, maxRadius, minRadius int) (*[600]string, error) {
	checkInRange := func(a airport) bool {
		var distance float64
		geodesic.WGS84.Inverse(float64(latitude), float64(longitude), float64(a.lat), float64(a.lon), &distance, nil, nil)
		return float64(minRadius) <= distance && distance <= float64(maxRadius)
	}
	var res [600]string
	var i int
	var inRange bool

	file, err := os.Open("airports.json")
	if err != nil {
		fmt.Printf("failed to load airports.json: %v\n", err)
		return nil, err
	}
	defer file.Close()

	var airports []airport
	decoder := json.NewDecoder(file) // TODO: airports.json is an array of arrays, need to either decode that accordingly or modify this
	if err := decoder.Decode(&airports); err != nil {
		fmt.Printf("failed to decode airports.json: %v\n", err)
		return nil, err
	}

	for _, airport := range airports {
		inRange = checkInRange(airport)
		if inRange {
			res[i] = airport.code
			i++
		}
		if i >= 600 {
			break
		}
	}

	return &res, nil
}
