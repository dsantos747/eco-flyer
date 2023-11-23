import { revalidateTag } from 'next/cache';
import { emissionsError } from '@/app/components/exceptions.js';
import { TripCard } from '../../../components/tripCard.js';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import { getRedis } from '@/app/actions/redisActions.js';
import { redisClient } from '@/lib/db.js';

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

async function page({ params }) {
  const results = await getRedis('response', params.id);
  const route_results = await JSON.parse(results);
  // redisClient.quit();

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
