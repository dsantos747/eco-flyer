import { revalidateTag } from 'next/cache';
import { emissionsError } from '@/app/components/exceptions.js';
import { getRedis } from '@/app/actions/redisActions';
import { StatusPoll } from '@/app/components/statusPolling';
import { taskCreate } from '@/app/actions/taskCreate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons';
// import { redisClient } from '@/lib/db';

function normaliseDate(uglyDate) {
  return `${uglyDate.slice(8)}/${uglyDate.slice(5, 7)}/${uglyDate.slice(0, 4)}`;
}

async function fetchResults(id) {
  ///////////////////
  const request = await getRedis('request', id);
  const data = await JSON.parse(request);
  //////////////////////

  // console.log(data['latLong']['lat']);

  // const formResults = await JSON.parse(cookies().get('formResults')?.value);
  // const formResults = getCookies('formResults');
  // const { location, outboundDate, outboundDateEndRange, returnDate, returnDateEndRange, tripLength, latLong, price } = await request;

  //////////////////////

  /////////////////////////////////

  // revalidateTag('emissions');

  // const airports = await airportsFetch(data['latLong'], data['tripLength']);
  // console.log('airports done');
  // const rawTrips = await tequilaFetch(
  //   airports.origin,
  //   airports.destination,
  //   data['outboundDate'],
  //   data['outboundDateEndRange'],
  //   data['returnDate'],
  //   data['returnDateEndRange'],
  //   data['price']
  // );
  // console.log('tequila done');
  // const sortedTequila = await sortedTequilaFetch(rawTrips);
  // console.log('sorting done');
  // const tripEmissions = await tripEmissionsFetch(sortedTequila);
  // console.log('emissions done');
  // const routeResults = await sortedEmissionsFetch(id, sortedTequila, tripEmissions);

  if (process.env.NODE_ENV == 'development') {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const query_url = `${baseUrl}/processRequest/${id.toString()}`;
    const response = await fetch(query_url);
    const responseMessage = await response.json();
    // console.log(responseMessage);
    // throw new Error('test error');
  } else {
    taskCreate(id);
  }

  // const sortedResults = Object.fromEntries(
  //   Object.entries(routeResults).sort((a, b) => getFirstTripEmissions(a[1]) - getFirstTripEmissions(b[1]))
  // );

  //   const destinations = Object.keys(sortedResults); // Array used for referring to for sort order - Is this needed?

  // const router = useRouter();

  // router.push(`/results/${id}`);
  // redirect(`/results/${id}`);
}

async function page({ params }) {
  fetchResults(params.id);

  return (
    <div className="flex flex-col gap-3 text-center mx-auto px-6">
      <div>
        <h3 className="text-lg">Please wait while we prepare your personalised travel suggestions.</h3>
      </div>
      <div className="flex flex-col gap-6 items-center animate-spin-slow">
        <FontAwesomeIcon icon={faPlane} className="text-xl text-rose-200" />
        <FontAwesomeIcon icon={faPlane} className="rotate-180 text-xl text-rose-200" />
      </div>
      <div>
        <h3 className="text-md italic text-slate-600 pt-6">
          Fact: Aviation accounts for 2.5% of global annual CO<sub>2</sub> emissions.
        </h3>
      </div>

      <StatusPoll taskID={params.id}></StatusPoll>
    </div>
  );
}

export default page;
