import { revalidateTag } from 'next/cache';
import { emissionsError } from '@/app/components/exceptions.js';
import { TripCard } from '../../../components/tripCard.js';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import { ResultsFetch } from '../../../components/resultsFetch.js';
import { getRedis } from '@/app/actions/redisActions.js';

function getFirstTripEmissions(destination) {
  for (const option in destination) {
    if (destination.hasOwnProperty(option)) {
      return destination[option].trip_emissions;
    }
  }
}

function normaliseDate(uglyDate) {
  return `${uglyDate.slice(8)}/${uglyDate.slice(5, 7)}/${uglyDate.slice(0, 4)}`;
}

// export const emissionsFetch = async (latLong, outboundDate, outboundDateEndRange, returnDate, returnDateEndRange, tripLength, price) => {
//   const baseUrl = process.env.NEXT_PUBLIC_API_URL;

//   revalidateTag('emissions'); // This is used to trigger a re-fetching of data. Should trigger this only if request body has changed
//   // Maybe see if there's a way of checking a cookie's age?

//   let params = { lat: latLong.lat, long: latLong.long, len: tripLength };
//   let paramsURL = new URLSearchParams(params);
//   let query_url = `${baseUrl}/api/results/airports?${paramsURL.toString()}`;

//   // FIX - Remove unnecessary params from all fetch params

//   let originAirports, destinationAirports;

//   try {
//     const response = await fetch(query_url, {
//       next: { tags: ['emissions'] },
//     });
//     if (response.ok) {
//       const data = await response.json();
//       originAirports = data.origin_airports;
//       destinationAirports = data.destination_airports;
//       console.log('airports fetched');
//     } else {
//       console.error('Error: response not Ok', response.status, response.statusText);
//       throw new emissionsError();
//     }
//   } catch (error) {
//     console.error(error);
//     throw new emissionsError(); // Make a more specific error here, such as "Error getting departure location / destination airports"
//   }

//   query_url = `${baseUrl}/api/results/tequila`;
//   let rawDestinations;
//   outboundDate = normaliseDate(outboundDate);
//   outboundDateEndRange = normaliseDate(outboundDateEndRange);
//   returnDate = normaliseDate(returnDate);
//   returnDateEndRange = normaliseDate(returnDateEndRange);
//   try {
//     const response = await fetch(query_url, {
//       method: 'POST',
//       body: JSON.stringify({
//         originAirports,
//         destinationAirports,
//         outboundDate,
//         outboundDateEndRange,
//         returnDate,
//         returnDateEndRange,
//         price,
//       }),
//       headers: { 'Content-Type': 'application/json' },
//       next: { tags: ['emissions'] },
//     });
//     if (response.ok) {
//       const data = await response.json();
//       if (data.error) {
//         console.error('Backend error:', data.error);
//         throw new emissionsError();
//       } else {
//         rawDestinations = data;
//         console.log('raw tequila fetched');
//       }
//     } else {
//       console.error('Error: response not Ok', response.status, response.statusText);
//       throw new emissionsError();
//     }
//   } catch (error) {
//     //Client-side error
//     console.error(error);
//     throw new emissionsError(error.message);
//   }

//   query_url = `${baseUrl}/api/results/tequilaSort`;
//   let sortedDestinations;
//   try {
//     const response = await fetch(query_url, {
//       method: 'POST',
//       body: JSON.stringify(rawDestinations),
//       headers: { 'Content-Type': 'application/json' },
//       next: { tags: ['emissions'] },
//     });
//     if (response.ok) {
//       const data = await response.json();
//       sortedDestinations = data;
//       console.log('sorted tequila fetched');
//     } else {
//       console.error('Error: response not Ok', response.status, response.statusText);
//       throw new emissionsError();
//     }
//   } catch (error) {
//     console.error(error);
//     throw new emissionsError();
//   }

//   query_url = `${baseUrl}/api/results/emissions`;
//   let rawEmissions;
//   try {
//     const response = await fetch(query_url, {
//       method: 'POST',
//       body: JSON.stringify(sortedDestinations),
//       headers: { 'Content-Type': 'application/json' },
//       next: { tags: ['emissions'] },
//     });
//     if (response.ok) {
//       const data = await response.json();
//       rawEmissions = data;
//       console.log('emissions fetched');
//     } else {
//       console.error('Error: response not Ok', response.status, response.statusText);
//       throw new emissionsError();
//     }
//   } catch (error) {
//     console.error(error);
//     throw new emissionsError();
//   }

//   query_url = `${baseUrl}/api/results/sort`;
//   let parsedResults;
//   try {
//     const response = await fetch(query_url, {
//       method: 'POST',
//       body: JSON.stringify({ sortedDestinations, rawEmissions }),
//       headers: { 'Content-Type': 'application/json' },
//       next: { tags: ['emissions'] },
//     });
//     if (response.ok) {
//       const data = await response.json();
//       parsedResults = data;
//       console.log('sorted results fetched');
//     } else {
//       console.error('Error: response not Ok', response.status, response.statusText);
//       throw new emissionsError();
//     }
//   } catch (error) {
//     console.error(error);
//     throw new emissionsError();
//   }

//   return parsedResults;
//   // Test error throw to stop action
//   // throw new emissionsError();
// };

async function fetchTrips() {
  const response = JSON.parse(cookies().get('tripResults')?.value);
  const { location, outboundDate, outboundDateEndRange, returnDate, returnDateEndRange, tripLength, latLong, price } = response;
  // const route_results = await emissionsFetch(latLong, outboundDate, outboundDateEndRange, returnDate, returnDateEndRange, tripLength);
  // const route_results = emissionsFetch(latLong, outboundDate, outboundDateEndRange, returnDate, returnDateEndRange, tripLength, price);
  // const sorted_result = Object.fromEntries(
  //   Object.entries(route_results).sort((a, b) => getFirstTripEmissions(a[1]) - getFirstTripEmissions(b[1]))
  // );
  // const destinations = Object.keys(sorted_result); // Array used for referring to for sort order
}

async function page({ params }) {
  // const response = await JSON.parse(cookies().get('tripResults')?.value);
  // console.log(response);

  // const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  // const data = await fetch(`${baseUrl}/getResults/${params.id}`, {
  //   method: 'GET',
  //   // credentials: 'include',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Credentials': 'true',
  //   },
  // });

  const results = await getRedis('response', params.id);
  const route_results = JSON.parse(results);

  // const route_object = await data.json();
  // const route_results = JSON.parse(route_object.data);

  const sorted_result = Object.fromEntries(
    Object.entries(route_results).sort((a, b) => getFirstTripEmissions(a[1]) - getFirstTripEmissions(b[1]))
  );
  const destinations = Object.keys(sorted_result); // Array used for referring to for sort order

  return (
    <div>
      {/* <h1 className="text-4xl">This is some test text, to verify if Vercel issues are caused by await on emissionsFetch</h1> */}
      {/* <Suspense fallback={<p className="text-2xl">Loading results...</p>}> */}
      <TripCard emissions={route_results} destinations={destinations} option={1}></TripCard>
      {/* <div>Testing testing</div> */}
      {/* </Suspense> */}
    </div>
  );
}

export default page;