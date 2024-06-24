package main

type Airport struct {
	Code string  `json:"code"`
	Lat  float32 `json:"lat"`
	Lon  float32 `json:"lon"`
}

type RawTequilaResponse struct {
	Data     []RawTequilaItinerary `json:"data"`
	SearchId string                `json:"search_id"`
}

type RawTequilaItinerary struct {
	CityTo         string  `json:"cityTo"`
	CityFrom       string  `json:"cityFrom"`
	FlyFrom        string  `json:"flyFrom"`
	FlyTo          string  `json:"flyTo"`
	LocalDeparture string  `json:"local_departure"`
	Price          float32 `json:"price"`
	DeepLink       string  `json:"deep_link"`
	Route          []Leg   `json:"route"`
}

type TequilaItinerary struct {
	CityTo         string
	CityFrom       string
	FlyFrom        string
	FlyTo          string
	LocalDeparture string
	Price          float32
	DeepLink       string
	Flights        [2]map[string]Leg
	TotalLegs      int
	OutLegs        int
	RetLegs        int
	ImgUrl         string
	// Add additional fields that are post-computed (not from api). I.e.
}

type Leg struct {
	CityTo            string `json:"cityTo"`
	CityFrom          string `json:"cityFrom"`
	FlyFrom           string `json:"flyFrom"`
	FlyTo             string `json:"flyTo"`
	LocalDeparture    string `json:"local_departure"`
	Airline           string `json:"airline"`
	FlightNo          string `json:"flight_no"`
	OperatingCarrier  string `json:"operating_carrier"`
	OperatingFlightNo string `json:"operating_flight_no"`
	Return            int    `json:"return"`
}

type UnsplashResponse struct {
	Results []UnsplashResults `json:"results"`
}

type UnsplashResults struct {
	Urls map[string]string `json:"urls"`
}

type TIMrequest struct{}

type TIMflight struct {
	Origin               string     `json:"origin"`
	Destination          string     `json:"destination"`
	OperatingCarrierCode string     `json:"operatingCarrierCode"`
	FlightNumber         int        `json:"flightNumber"`
	DepartureDate        DateStruct `json:"departureDate"`
}

type DateStruct struct {
	Year  string `json:"year"`
	Month string `json:"month"`
	Day   string `json:"day"`
}
