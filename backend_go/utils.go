package main

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/joho/godotenv"
)

var HTTPclient = &http.Client{
	Timeout: time.Second * 30,
}

// Makes an HTTP request of the required method to the specified endpoint.
// If response code is >= 400 , returns an error with response.Status
func MakeHTTPRequest(method, endpoint string, body io.Reader, params, headers map[string]string) (*http.Response, error) {
	// Add params to url
	if params != nil {
		values := url.Values{}
		for k, v := range params {
			values.Add(k, v)
		}
		query := values.Encode()
		endpoint = fmt.Sprintf("%s?%s", endpoint, query)
	}

	// Prepare the request
	req, err := http.NewRequest(method, endpoint, body)
	if err != nil {
		return nil, err
	}
	for k, v := range headers {
		req.Header.Set(k, v)
	}

	// Perform the request
	response, err := HTTPclient.Do(req)
	if err != nil {
		return nil, err
	}
	if response.StatusCode != 200 {
		err = fmt.Errorf("%s", response.Status)
		return nil, err
	}

	return response, nil
}

// LoadEnv attempts to load an env var "ENVIRONMENT". If successful, no further action.
// If not successful, load all envs with godotenv instead
func LoadEnv() error {
	if os.Getenv("ENVIRONMENT") == "" {
		err := godotenv.Load("../frontend/.env.local")
		if err != nil {
			fmt.Printf("Could not load environment variables from .env file: %v\n", err)
			return err
		}
	}
	return nil
}
