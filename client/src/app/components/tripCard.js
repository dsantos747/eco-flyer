"use client";

import { useState } from "react";
import { ActionButton } from "./actionButton.js";

const formatDate = (date) => {
  const year = date.slice(0, 4);
  const month = date.slice(5, 7);
  const day = date.slice(8, 10);
  const hour = date.slice(11, 13);
  const minute = date.slice(14, 16);

  return `${day}/${month}/${year}, ${hour}:${minute}`;
};

export function TripCard({ emissions, destinations, option }) {
  const [tripDestination, settripDestination] = useState(0);
  const [tripOption, setTripOption] = useState(option);

  const handleDestinationChange = (change) => {
    if (tripDestination + change < destinations.length && tripDestination + change >= 0) {
      setTripOption(0);
      settripDestination(tripDestination + change);
    }
  };
  const handleOptionChange = (change) => {
    if (tripOption + change == emissions[destinations[tripDestination]].length) {
      setTripOption(0);
    } else {
      setTripOption(tripOption + change);
    }
  };

  const currentTrip = emissions[destinations[tripDestination]][tripOption];

  const firstOutbound = currentTrip.flights[0][0];
  const firstReturn = currentTrip.flights[currentTrip.flights.length - 1][0];
  return (
    <div className="flex justify-center items-center py-4 gap-3">
      <div>
        <ActionButton
          onChange={handleDestinationChange}
          direction={-1}
          className={"h-20 w-20 font-semibold text-4xl text-center rounded-full bg-slate-200 text-slate-400"}
        >
          &lt;
        </ActionButton>
      </div>
      <div>
        <div className="relative">
          <img src={currentTrip.img_url} className="object-cover w-full h-full rounded-xl" alt={currentTrip.cityTo}></img>
          <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-between">
            <div className="bg-white bg-opacity-60 rounded-md py-2 px-2">
              From {currentTrip.cityFrom} ({firstOutbound.flyFrom}), how about:
            </div>
            <div className="bg-gradient-destination pb-2 pt-28 px-2">
              <h2 className="text-2xl text-blue-900 font-bold">{currentTrip.cityTo}</h2>
              <div>Fly out: {formatDate(firstOutbound.local_departure)}</div>
              <div>Return: {formatDate(firstReturn.local_departure)}</div>
              <div>
                Emissions: {Math.round(currentTrip.trip_emissions / 100) / 10} kg CO<sub>2</sub>/person
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between py-2">
          <ActionButton onChange={handleOptionChange} direction={1} className={"h-10 w-48 text-center rounded-md bg-slate-300"}>
            Alternate Flights
          </ActionButton>
          <button className="h-10 w-48 text-center rounded-md font-semibold bg-teal-600 text-white">
            {currentTrip.price}€ on Kiwi.com
          </button>{" "}
          {/*Add multi-currency support*/}
        </div>
      </div>
      <div>
        <ActionButton
          onChange={handleDestinationChange}
          direction={1}
          className={"h-20 w-20 font-semibold text-4xl rounded-full bg-slate-200 text-slate-400"}
        >
          &gt;
        </ActionButton>
      </div>
    </div>
  );
}
