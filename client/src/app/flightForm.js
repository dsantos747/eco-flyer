"use client";

import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { experimental_useFormState as useFormState } from "react-dom";
import { useState, useEffect } from "react";
import { revalidateTag } from "next/cache";
import { createContext } from "react";
import Link from "next/link";
import { createRequestCookies } from "./formServer";

const requestContext = createContext();

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
    location: "", // Change this to be co-ordinates, calculated from the inputted location
    outboundDate: "2023-11-01", //formatDate(new Date()),
    outboundDateEndRange: "2023-11-03", //formatDate(new Date(), 2),
    returnDate: "2023-11-10", //formatDate(new Date(), 5),
    returnDateEndRange: "2023-11-12", //formatDate(new Date(), 7),
    tripLength: "trip-medium",
  });
  const [suggestions, setSuggestions] = useState([]);
  const [debouncedSuggestions, setDebouncedSuggestions] = useState([]);

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
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${debouncedSuggestions}&limit=5`);
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    };

    if (debouncedSuggestions) {
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
    form.preventDefault(); //Prevent page refresh upon form submission

    const formDataJSON = JSON.stringify(formData, null, 2);
    console.log("Form Data (JSON):", formDataJSON);

    createRequestCookies(formDataJSON);
  };

  const getUserLocation = () => {
    console.log("Get user location");
  };

  return (
    <div>
      <form id="flightForm" onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="location"
            placeholder="Starting Location"
            value={formData.location}
            onChange={handleLocationInputChange}
          ></input>
          <ul>
            {suggestions.map((location) => (
              <li key={location.place_id} className="cursor-pointer" onClick={() => handleSuggestionClick(location)}>
                {location.display_name}
              </li>
            ))}
          </ul>
          <button type="button" onClick={getUserLocation}>
            Use current location
          </button>
        </div>
        <div>
          <input
            type="date"
            name="outboundDate"
            placeholder="Outbound Date"
            value={formData.outboundDate}
            onChange={handleInputChange}
            required
          ></input>
          <input
            type="date"
            name="outboundDateEndRange"
            placeholder="Outbound Date End Range"
            value={formData.outboundDateEndRange}
            onChange={handleInputChange}
          ></input>
        </div>
        <div>
          <input
            type="date"
            name="returnDate"
            placeholder="Return Date"
            value={formData.returnDate}
            onChange={handleInputChange}
            required
          ></input>
          <input
            type="date"
            name="returnDateEndRange"
            placeholder="Return Date End Range"
            value={formData.returnDateEndRange}
            onChange={handleInputChange}
          ></input>
        </div>

        <div>
          <input
            type="radio"
            id="trip-short"
            name="tripLength"
            value="trip-short"
            checked={formData.tripLength === "trip-short"}
            onChange={handleInputChange}
          ></input>
          <label htmlFor="trip-short">Near</label>
          <input
            type="radio"
            id="trip-medium"
            name="tripLength"
            value="trip-medium"
            checked={formData.tripLength === "trip-medium"}
            onChange={handleInputChange}
          ></input>
          <label htmlFor="trip-medium">Far</label>
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
        <button type="submit" className="h-10 px-2 text-center rounded-md font-semibold bg-blue-400 text-rose-200">
          Submit & make flight search
        </button>
      </form>
    </div>
  );
}
