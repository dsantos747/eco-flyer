"use client";

import { useState, useEffect } from "react";
import { createRequestCookies } from "./formServer";

const formatDate = (date, offset = 0) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate() + offset;

  const formattedMonth = String(month).padStart(2, "0");
  const formattedDate = String(day).padStart(2, "0");

  return `${year}-${formattedMonth}-${formattedDate}`;
};

export function FlightForm() {
  const [formData, setFormData] = useState({
    location: "",
    latLong: "",
    outboundDate: formatDate(new Date()),
    outboundDateEndRange: formatDate(new Date(), 2),
    returnDate: formatDate(new Date(), 5),
    returnDateEndRange: formatDate(new Date(), 7),
    tripLength: "trip-medium",
  });
  const [suggestions, setSuggestions] = useState([]);
  const [debouncedSuggestions, setDebouncedSuggestions] = useState([]);
  const [inputFocus, setInputFocus] = useState(false);
  const [locationButtonDisabled, setLocationButton] = useState(false);

  const handleFocus = () => {
    setInputFocus(true);
  };

  const handleBlur = () => {
    setInputFocus(false);
  };

  const handleLocationInputChange = async (input) => {
    const { name, value } = input.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSuggestions(formData.location);
    }, 1000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [formData.location]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${debouncedSuggestions}&limit=5&featureType=city` //&addressdetails=1
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    };

    if (debouncedSuggestions && inputFocus === true) {
      fetchData();
    } else {
      setSuggestions([]);
    }
  }, [debouncedSuggestions]);

  const handleSuggestionClick = (location) => {
    setFormData((prevData) => ({
      ...prevData,
      "location": location.display_name,
      "latLong": { "lat": location.lat, "long": location.lon },
    }));
    setSuggestions([]);
  };

  const handleInputChange = (input) => {
    const { name, value } = input.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (form) => {
    form.preventDefault();
    const formDataJSON = JSON.stringify(formData, null, 2);
    createRequestCookies(formDataJSON);
  };

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const crd = pos.coords;
        try {
          setLocationButton(true);
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${crd.latitude}&lon=${crd.longitude}&zoom=10&format=json`
          );
          const userLocation = await response.json();
          // prettier-ignore
          let parsedUserLocation = `${userLocation.address.city || ""}${userLocation.address.city == undefined ? "" : ", "}${userLocation.address.county || ""}${userLocation.address.county == undefined ? "" : ", "}${userLocation.address.country || ""}`;
          setFormData((prevData) => ({
            ...prevData,
            "location": parsedUserLocation,
            "latLong": { "lat": crd.latitude, "long": crd.longitude },
          }));
          setLocationButton(false);
        } catch (error) {
          console.error("Error fetching location", error);
        }
      });
    }
  };

  return (
    <div className="w-full">
      <form id="flightForm" onSubmit={handleSubmit} className="flex justify-center items-center flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-1 w-full px-20 items-center">
          <p className="flex-none">
            Departure Location<span className="text-red-500">*</span>
          </p>
          <div className="flex-auto">
            <input
              className="w-full text-center md:text-start"
              type="text"
              name="location"
              placeholder="Starting Location"
              value={formData.location}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleLocationInputChange}
              required
            ></input>
            <ul className="z-10 fixed bg-white">
              {suggestions.map((location) => (
                <li key={location.place_id} className="cursor-pointer" onClick={() => handleSuggestionClick(location)}>
                  {location.display_name}
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            onClick={getUserLocation}
            disabled={locationButtonDisabled}
            aria-disabled={locationButtonDisabled}
            className={`flex-none px-2 text-center rounded-md bg-rose-50 border-2 ${
              locationButtonDisabled ? "cursor-not-allowed" : "hover:bg-gray-400"
            }`}
          >
            {locationButtonDisabled ? "Processing..." : "Use My Location"}
          </button>
        </div>
        <div className="flex justify-evenly gap-2 w-full">
          <div className="flex gap-1 flex-wrap w-1/2 justify-end">
            <label htmlFor="outboundDate" className="flex-auto text-right">
              Outbound Date<span className="text-red-500">*</span>
            </label>
            <input
              id="outboundDate"
              type="date"
              name="outboundDate"
              placeholder="Outbound Date"
              value={formData.outboundDate}
              onChange={handleInputChange}
              required
            ></input>
          </div>
          <div className="flex gap-1 flex-wrap-reverse w-1/2">
            <input
              id="outboundDateEndRange"
              type="date"
              name="outboundDateEndRange"
              placeholder="Outbound Date End Range"
              value={formData.outboundDateEndRange}
              onChange={handleInputChange}
            ></input>
            <label htmlFor="outboundDateEndRange">Outbound Date Range</label>
          </div>
        </div>
        <div className="flex justify-evenly gap-2 w-full">
          <div className="flex gap-1 flex-wrap w-1/2 justify-end">
            <label htmlFor="returnDate" className="flex-auto text-right">
              Return Date<span className="text-red-500">*</span>
            </label>
            <input
              id="returnDate"
              type="date"
              name="returnDate"
              placeholder="Return Date"
              value={formData.returnDate}
              onChange={handleInputChange}
              required
            ></input>
          </div>
          <div className="flex gap-1 flex-wrap-reverse w-1/2">
            <input
              id="returnDateEndRange"
              type="date"
              name="returnDateEndRange"
              placeholder="Return Date End Range"
              value={formData.returnDateEndRange}
              onChange={handleInputChange}
            ></input>
            <label htmlFor="returnDateEndRange">Return Date Range</label>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-2">
          <p>
            How far would you like to travel?<span className="text-red-500">*</span>
          </p>
          <div className="flex gap-1">
            <input
              type="radio"
              id="trip-short"
              name="tripLength"
              value="trip-short"
              checked={formData.tripLength === "trip-short"}
              onChange={handleInputChange}
            ></input>
            <label htmlFor="trip-short">Near</label>
          </div>
          <div className="flex gap-1">
            <input
              type="radio"
              id="trip-medium"
              name="tripLength"
              value="trip-medium"
              checked={formData.tripLength === "trip-medium"}
              onChange={handleInputChange}
            ></input>
            <label htmlFor="trip-medium">Far</label>
          </div>
          <div className="flex gap-1">
            <input
              type="radio"
              id="trip-long"
              name="tripLength"
              value="trip-long"
              checked={formData.tripLength === "trip-long"}
              onChange={handleInputChange}
            ></input>
            <label htmlFor="trip-long">Really Far</label>
          </div>
        </div>
        <button type="submit" className="h-10 px-2 text-center rounded-md font-semibold bg-blue-400 text-black">
          Let's Fly!
        </button>
      </form>
    </div>
  );
}
