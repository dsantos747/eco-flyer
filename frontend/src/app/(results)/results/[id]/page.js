import { TripCard } from '../../../components/tripCard.js';
import { getRedis } from '@/app/actions/redisActions.js';

function getFirstTripEmissions(destination) {
  for (const option in destination) {
    if (destination.hasOwnProperty(option)) {
      return destination[option].trip_emissions;
    }
  }
}

async function page({ params }) {
  const results = await getRedis('response', params.id);
  const route_results = await JSON.parse(results);
  const sorted_result = Object.fromEntries(
    Object.entries(route_results).sort((a, b) => getFirstTripEmissions(a[1]) - getFirstTripEmissions(b[1]))
  );
  const destinations = Object.keys(sorted_result); // Array used for referring to for sort order

  return (
    <div>
      <TripCard emissions={route_results} destinations={destinations} option={1}></TripCard>
    </div>
  );
}

export default page;
