'use client';

import { revalidateTag } from 'next/cache';
import { emissionsError } from '@/app/components/exceptions.js';
// import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createRequestCookies, getCookies } from '../../components/cookieBaker';
import { emissionsFetch } from '@/app/components/resultsFetch';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function getFirstTripEmissions(destination) {
  for (const option in destination) {
    if (destination.hasOwnProperty(option)) {
      return destination[option].trip_emissions;
    }
  }
}

// function normaliseDate(uglyDate) {
//   return `${uglyDate.slice(8)}/${uglyDate.slice(5, 7)}/${uglyDate.slice(0, 4)}`;
// }

// export const emissionsFetch = async (latLong, outboundDate, outboundDateEndRange, returnDate, returnDateEndRange, tripLength, price) => {
//   const baseUrl = process.env.API_URL;

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

async function fetchResults() {
  // Consider launching this whole process as a server action?

  // const router = useRouter();

  // const formResults = await JSON.parse(cookies().get('formResults')?.value);
  const formResults = getCookies('formResults');
  const { location, outboundDate, outboundDateEndRange, returnDate, returnDateEndRange, tripLength, latLong, price } = await formResults;
  const routeResults = await emissionsFetch(latLong, outboundDate, outboundDateEndRange, returnDate, returnDateEndRange, tripLength, price);
  const sortedResults = Object.fromEntries(
    Object.entries(routeResults).sort((a, b) => getFirstTripEmissions(a[1]) - getFirstTripEmissions(b[1]))
  );

  //   const destinations = Object.keys(sortedResults); // Array used for referring to for sort order - Is this needed?
  // Create cookies here, to be accessed by results page

  createRequestCookies('tripResults', sortedResults);
  console.log('cookies created');
  // router.push('/results');
  // redirect('/results');
}

async function page() {
  fetchResults();

  return (
    <div>
      <div>This is a middle-ground page, which will do all the fetching in the background, but render a static page</div>
      <Link href="/results">See Results</Link>
    </div>
  );
}

export default page;
