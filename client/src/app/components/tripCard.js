"use client";

import { useState } from "react";
import { ActionButton } from "./actionButton.js";

const formatDate = (date) => {
  const year = date.slice(0, 4);
  const month = date.slice(5, 7);
  const day = date.slice(8, 10);

  return `${day}/${month}/${year}`;
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
    <div>
      <div>From {currentTrip.cityFrom}, how about:</div>
      {/* <div>{ LOCATION IMAGE HERE }</div> */}
      <div>{currentTrip.cityTo}</div>
      <div>
        Fly out {formatDate(firstOutbound.local_departure)}, return {formatDate(firstReturn.local_departure)}
      </div>
      <div>Total Emissions: {currentTrip.trip_emissions / 1000}kg CO2 per person</div>
      <ActionButton onChange={handleDestinationChange} direction={-1}>
        Previous Destination
      </ActionButton>
      <ActionButton onChange={handleDestinationChange} direction={1}>
        Next Destination
      </ActionButton>
      <ActionButton onChange={handleOptionChange} direction={1}>
        Alternate Flights
      </ActionButton>
    </div>
  );
}
