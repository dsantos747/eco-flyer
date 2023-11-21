'use client';

import { useState } from 'react';
import { ActionButton } from './actionButton.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

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
      setTripOption(1);
      settripDestination(tripDestination + change);
    }
  };
  const handleOptionChange = (change) => {
    if (tripOption + change >= Object.keys(emissions[destinations[tripDestination]]).length) {
      setTripOption(1);
    } else {
      setTripOption(tripOption + change);
    }
  };

  const currentTrip = emissions[destinations[tripDestination]][`option_${tripOption}`];
  const firstOutbound = currentTrip.flights[0]['step_1'];
  const firstReturn = currentTrip.flights[currentTrip.flights.length - 1]['step_1'];
  return (
    <div className="">
      {/* flex justify-center items-center gap-3 */}
      {/* <div className="sm:max-md:relative sm:max-md:left-44 z-20"></div> */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <img
            src={currentTrip.img_url}
            className="object-cover rounded-xl max-w-[80vw] md:max-w-[90vw] max-h-[75vh]"
            alt={currentTrip.cityTo}
          ></img>
          <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-between">
            <div className="bg-white bg-opacity-60 rounded-t-xl rounded-b-md py-2 px-2">
              From {currentTrip.cityFrom} (<span className="font-semibold text-blue-900">{firstOutbound.flyFrom}</span>), how about:
            </div>
            {/* sm:max-md:absolute sm:max-md:left-44 */}
            <ActionButton
              onChange={handleDestinationChange}
              direction={-1}
              className={
                'left-2 top-1/2 absolute md:-left-20 lg:-left-28 bg-opacity-70 md:bg-opacity-100 h-16 w-16 lg:h-20 lg:w-20 flex items-center justify-center rounded-full active:scale-95 bg-white text-blue-900 hover:text-sky-500'
              }
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-xl md:text-xl lg:text-2xl  rotate-180 " />
            </ActionButton>
            <ActionButton
              onChange={handleDestinationChange}
              direction={1}
              className={
                'right-2 top-1/2 absolute md:-right-20 lg:-right-28 bg-opacity-70 md:bg-opacity-100 h-16 w-16 lg:h-20 lg:w-20 flex items-center justify-center rounded-full active:scale-95 bg-white text-blue-900 hover:text-sky-500'
              }
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-xl md:text-xl lg:text-2xl" />
            </ActionButton>
            <div className="bg-gradient-destination pb-2 pt-28 px-2 rounded-bl-xl">
              <h2 className="text-2xl text-blue-900 font-bold">
                {currentTrip.cityTo} (<span className="font-semibold text-blue-900">{firstOutbound.flyTo}</span>)
              </h2>
              <div>Fly out: {formatDate(firstOutbound.local_departure)}</div>
              <div>Return: {formatDate(firstReturn.local_departure)}</div>
              <div>
                Emissions: {Math.round(currentTrip.trip_emissions / 100) / 10} kg CO<sub>2</sub>/person
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between py-2 gap-2">
          <ActionButton
            onChange={handleOptionChange}
            direction={1}
            className={'h-10 w-36 md:w-48 text-center rounded-md bg-white hover:bg-slate-300 active:scale-95'}
          >
            Shuffle Flights
          </ActionButton>
          <a
            href={currentTrip.deep_link}
            target="_blank"
            className="h-10 w-36 md:w-48 flex items-center justify-center rounded-md font-semibold bg-teal-600 hover:bg-teal-700 active:scale-95 text-white"
          >
            {currentTrip.price}€ on Kiwi.com
          </a>
          {/*Add multi-currency support*/}
        </div>
      </div>
    </div>
  );
}
