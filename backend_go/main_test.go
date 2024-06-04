package ecoflyer

import (
	"testing"
)

func TestGetNearbyAirports(t *testing.T) {
	airports, err := getAirportsInRange(38.683333, -9.333333, 100, 0)

	if err != nil {
		t.Errorf("error getting nearby airports: %v\n", err)
	}

	if airports[0] != "LIS" {
		t.Errorf("Expected first airport code to be LIS")
	}
	if airports[1] != "CAT" {
		t.Errorf("Expected second airport code to be CAT")
	}
	if airports[2] != "" {
		t.Errorf("Expected no more than two airport codes")
	}
}
