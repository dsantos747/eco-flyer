'use client';

import { useState } from 'react';
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
  const outboundLegs = Object.keys(currentTrip.flights[0]);
  const lastOutbound = currentTrip.flights[0][outboundLegs[outboundLegs.length - 1]];
  const firstReturn = currentTrip.flights[currentTrip.flights.length - 1]['step_1'];
  const currentOptions = Object.keys(emissions[destinations[tripDestination]]).length;
  return (
    <div className=''>
      <div className='flex flex-col items-center'>
        <div className='relative'>
          {/* 200vw - 160; 300vw - w240; 400vw - w320; 500vw & above - w400 */}
          {/* sizes="(max-width: 500px) 80vw, (max-width: 800px) 50vw, (max-width: 1200px) 33vw, 20vw" */}
          {/* <Image
            src={currentTrip.img_url}
            // fill={true}
            height={600}
            width={400}
            alt='Destination image'
            // sizes='(max-width: 500px) 80vw, (max-width: 800px) 50vw, (max-width: 1200px) 33vw, 20vw'
            // className='rounded-xl w-full h-auto max-w-[80vw] md:max-w-[90vw] max-h-[75vh] object-cover'
          ></Image> */}
          <img
            src={currentTrip.img_url}
            className='object-cover rounded-xl max-w-[80vw] md:max-w-[90vw] max-h-[75vh]'
            alt={currentTrip.cityTo}></img>
          <div className='absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-between'>
            <div className='bg-white bg-opacity-60 rounded-t-xl rounded-b-md py-2 px-2'>
              From {currentTrip.cityFrom} (<span className='font-semibold text-blue-900'>{firstOutbound.flyFrom}</span>), how about:
            </div>
            <button
              className='left-2 top-1/2 absolute md:-left-20 lg:-left-28 bg-opacity-70 md:bg-opacity-100 h-16 w-16 lg:h-20 lg:w-20 flex items-center justify-center rounded-full enabled:active:scale-95 bg-white text-blue-900 hover:text-sky-500 disabled:bg-gray-300 disabled:opacity-50 disabled:md:opacity-80 disabled:text-gray-400'
              disabled={tripDestination === 0 ? true : false}
              aria-label='Previous Destination'
              onClick={() => {
                handleDestinationChange(-1);
              }}
              type='button'>
              <FontAwesomeIcon icon={faChevronRight} className='text-xl md:text-xl lg:text-2xl  rotate-180 ' />
            </button>
            <button
              className='right-2 top-1/2 absolute md:-right-20 lg:-right-28 bg-opacity-70 md:bg-opacity-100 h-16 w-16 lg:h-20 lg:w-20 flex items-center justify-center rounded-full enabled:active:scale-95 bg-white text-blue-900 hover:text-sky-500 disabled:bg-gray-300 disabled:opacity-80 disabled:text-gray-400'
              disabled={tripDestination === destinations.length - 1 ? true : false}
              aria-label='Next Destination'
              onClick={() => {
                handleDestinationChange(1);
              }}
              type='button'>
              <FontAwesomeIcon icon={faChevronRight} className='text-xl md:text-xl lg:text-2xl' />
            </button>
            <div className='bg-gradient-destination pb-2 pt-28 px-2 rounded-bl-xl'>
              <h2 className='text-2xl text-blue-900 font-bold'>
                {currentTrip.cityTo} (<span className='font-semibold text-blue-900'>{lastOutbound.flyTo}</span>)
              </h2>
              <div>Fly out: {formatDate(firstOutbound.local_departure)}</div>
              <div>Return: {formatDate(firstReturn.local_departure)}</div>
              <div>
                Emissions: {Math.round(currentTrip.trip_emissions / 100) / 10} kg CO<sub>2</sub>/person
              </div>
            </div>
          </div>
        </div>

        <div className='flex justify-between py-2 gap-2'>
          <button
            className='h-10 w-36 md:w-48 text-center rounded-md bg-white hover:bg-slate-300 enabled:active:scale-95 disabled:bg-gray-300 disabled:opacity-80 disabled:text-gray-400'
            aria-label='Shuffle Flights'
            disabled={currentOptions === 1 ? true : false}
            onClick={() => {
              handleOptionChange(1);
            }}
            type='button'>
            Shuffle Flights
          </button>
          <a
            href={currentTrip.deep_link}
            target='_blank'
            className='h-10 w-36 md:w-48 flex items-center justify-center rounded-md font-semibold bg-teal-600 hover:bg-teal-700 active:scale-95 text-white'>
            {currentTrip.price}€ on Kiwi.com
          </a>
          {/*Add multi-currency support*/}
        </div>
      </div>
    </div>
  );
}
