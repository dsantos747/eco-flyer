'use client';

import { useState, useEffect } from 'react';
import { createRequestCookies } from './cookieBaker';
import { redirect, useRouter } from 'next/navigation';
import { ToolTip } from './tooltip';
import { v4 } from 'uuid';
import { createRedis } from '../actions/redisActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';

const formatDate = (date, offset = 0) => {
  date = new Date(date.setDate(date.getDate() + offset));

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate(); // + offset

  const formattedMonth = String(month).padStart(2, '0');
  const formattedDate = String(day).padStart(2, '0');

  return `${year}-${formattedMonth}-${formattedDate}`;
};

export function FlightForm() {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [formData, setFormData] = useState({
    location: '',
    latLong: '',
    outboundDate: formatDate(new Date()),
    outboundDateEndRange: formatDate(new Date(), 1), // ''
    returnDate: formatDate(new Date(), 5),
    returnDateEndRange: formatDate(new Date(), 6), // ''
    tripLength: 'trip-medium',
    price: 300,
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
        console.error('Error fetching location suggestions:', error);
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
      'location': location.display_name,
      'latLong': { 'lat': location.lat, 'long': location.lon },
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
    // const id = v4();
    // const requestData = JSON.stringify(formData);
    createRedis(formData);
    // const result = await createRedis(formData);
    // const id = '9';

    // const request = await fetch(`${baseUrl}/saveRequest/${id}`, {
    //   method: 'POST',
    //   credentials: 'include',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Credentials': 'true',
    //   },
    //   body: JSON.stringify(formData),
    // });
    // const response = fetch(`${baseUrl}/processRequest/${id}`, {
    //   method: 'POST',
    //   credentials: 'include',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Credentials': 'true',
    //   },
    // });
    // createRequestCookies('formResults', formData);

    // redirect(`/progress/${id}`);
    // router.push(`/progress/${id}`);

    // submitData = formData;
    // if (submitData.outboundDateEndRange === '') submitData.outboundDateEndRange = formatDate(submitData.outboundDate, 1);
    // if (submitData.returnDateEndRange === '') submitData.returnDateEndRange = formatDate(submitData.returnDate, 1);

    // createRequestCookies('formResults', formData);
    // router.push('/progress');
  };

  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      setLocationButton(true);
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const crd = pos.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${crd.latitude}&lon=${crd.longitude}&zoom=10&format=json`,
            { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'max-age=7200' } }
          );
          const userLocation = await response.json();
          // prettier-ignore
          let parsedUserLocation = `${userLocation.address.city || ""}${userLocation.address.city == undefined ? "" : ", "}${userLocation.address.county || ""}${userLocation.address.county == undefined ? "" : ", "}${userLocation.address.country || ""}`;
          setFormData((prevData) => ({
            ...prevData,
            'location': parsedUserLocation,
            'latLong': { 'lat': crd.latitude, 'long': crd.longitude },
          }));
        } catch (error) {
          console.error('Error fetching location', error);
        }
        setLocationButton(false);
      });
    }
  };

  return (
    <div className="w-full">
      <form id="flightForm" onSubmit={handleSubmit} className="flex justify-center items-center flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-1 w-full px-10 md:px-20 items-center">
          <p className="md:flex-none">
            Departure Location<span className="text-red-500">*</span>
          </p>
          <div className="flex flex-auto gap-2">
            <div className="w-full flex-auto max-w-sm">
              <input
                className="w-full text-center md:text-start bg-rose-50 rounded-sm"
                type="text"
                name="location"
                placeholder="Enter your departure location or airport"
                autoComplete="off"
                value={formData.location}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleLocationInputChange}
                required
              ></input>
              <ul className="z-10 text-start fixed bg-rose-50">
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
              className={`flex-none px-2 text-center rounded-md text-slate-800 bg-rose-50 ${
                locationButtonDisabled ? 'cursor-not-allowed bg-slate-400 text-rose-200' : 'hover:bg-gray-400 active:scale-95'
              }`}
            >
              <FontAwesomeIcon icon={faLocationCrosshairs}></FontAwesomeIcon>
              {/* {locationButtonDisabled ? 'Processing...' : 'Use My Location'} */}
            </button>
          </div>
        </div>
        <div>Outbound Dates (Range):</div>
        <div className="flex justify-evenly gap-2 w-full">
          <div className="flex gap-1 w-1/2 justify-end">
            <label htmlFor="outboundDate" className="text-right text-slate-600 italic">
              From:<span className="text-red-500">*</span>
            </label>
            <input
              id="outboundDate"
              className="bg-rose-50 h-6 rounded-sm w-28"
              type="date"
              name="outboundDate"
              value={formData.outboundDate}
              onChange={handleInputChange}
              required
            ></input>
          </div>
          <div className="flex gap-1 w-1/2">
            <label htmlFor="outboundDateEndRange" className="text-right">
              To:<span className="text-red-500">*</span>
            </label>
            <input
              id="outboundDateEndRange"
              className={`bg-rose-50 h-6 rounded-sm w-28 ${formData.outboundDateEndRange == '' ? 'text-gray-400' : 'text-black'}`}
              type="date"
              name="outboundDateEndRange"
              value={formData.outboundDateEndRange}
              onChange={handleInputChange}
            ></input>
          </div>
        </div>
        <div>Return Dates (Range):</div>
        <div className="flex justify-evenly gap-2 w-full">
          <div className="flex gap-1 flex-wrap w-1/2 justify-end">
            <label htmlFor="returnDate" className="w-36 text-right">
              From:<span className="text-red-500">*</span>
            </label>
            <input
              id="returnDate"
              className="bg-rose-50 h-6 rounded-sm"
              type="date"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleInputChange}
              required
            ></input>
          </div>
          <div className="flex gap-1 flex-wrap w-1/2">
            <label htmlFor="returnDateEndRange" className="w-36 text-left">
              To:<span className="text-red-500">*</span>
            </label>
            <input
              id="returnDateEndRange"
              className={`bg-rose-50 h-6 rounded-sm ${formData.returnDateEndRange == '' ? 'text-gray-400' : 'text-black'}`}
              type="date"
              name="returnDateEndRange"
              placeholder="Return Date End Range"
              value={formData.returnDateEndRange}
              onChange={handleInputChange}
            ></input>
          </div>
        </div>

        <div className="flex flex-col items-center md:flex-row justify-between gap-2">
          <div>
            <p>
              How far would you like to travel?<span className="text-red-500">*</span>
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <div className="flex gap-1">
              <input
                type="radio"
                id="trip-short"
                name="tripLength"
                value="trip-short"
                checked={formData.tripLength === 'trip-short'}
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
                checked={formData.tripLength === 'trip-medium'}
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
                checked={formData.tripLength === 'trip-long'}
                onChange={handleInputChange}
              ></input>
              <label htmlFor="trip-long">Really Far</label>
            </div>
            <ToolTip
              html="Near: Destinations up to 1500km away<br />Far: Destinations 1500 to 4000km away<br />Really Far: Even Further!"
              place="bottom"
            >
              <p className="text-gray-500">(huh?)</p>
            </ToolTip>
          </div>
        </div>
        <div className="flex flex-col items-center md:flex-row justify-between gap-2">
          <p>
            What&apos;s your budget?<span className="text-red-500">*</span>
          </p>
          <div className="flex gap-3">
            <input
              type="range"
              id="price"
              name="price"
              min="100"
              max="1500"
              step="50"
              value={formData.price}
              onChange={handleInputChange}
            ></input>
            <div className="flex">
              <input
                type="number"
                name="price"
                min="100"
                max="1500"
                step="50"
                value={formData.price}
                onChange={handleInputChange}
                className="w-14 bg-rose-50 h-6 rounded-sm"
              ></input>
              <p>&euro;</p>
            </div>

            <ToolTip
              html="Set a price to keep results within your budget.<br />However, the following is recommended:<br />'Far' trips: at least 100€<br />'Really Far' trips: at least 600€"
              place="bottom"
            >
              <p className="text-gray-500">(huh?)</p>
            </ToolTip>
          </div>
        </div>
        <button
          type="submit"
          // disabled={true} // TEMPORARY ADDITION UNTIL RESULTS PAGE ROUTE IS SORTED
          className="h-10 px-2 text-center rounded-md font-semibold bg-blue-400 text-black hover:bg-blue-500 active:scale-95"
        >
          Let&apos;s Fly!
        </button>
      </form>
    </div>
  );
}
