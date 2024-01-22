import { getRedis } from '@/app/actions/redisActions';
import { StatusPoll } from '@/app/components/statusPolling';
import { taskCreate } from '@/app/actions/taskCreate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons';

async function fetchResults(id) {
  const request = await getRedis('request', id);
  const data = await JSON.parse(request);

  if (process.env.NODE_ENV == 'development') {
    const baseUrl = process.env.API_URL;
    const query_url = `${baseUrl}/processRequest/${id.toString()}`;
    const response = await fetch(query_url);
    const responseMessage = await response.json();
    console.log(responseMessage);
  } else {
    taskCreate(id);
  }
}

async function page({ params }) {
  fetchResults(params.id);

  return (
    <div className='flex flex-col gap-3 text-center mx-auto px-6'>
      <div>
        <h3 className='text-lg'>Please wait while we prepare your personalised travel suggestions.</h3>
      </div>
      <div className='flex flex-col gap-6 items-center animate-spin-slow'>
        <FontAwesomeIcon icon={faPlane} className='text-xl text-rose-200' />
        <FontAwesomeIcon icon={faPlane} className='rotate-180 text-xl text-rose-200' />
      </div>
      <div>
        <h3 className='text-md italic text-slate-600 pt-6'>
          Fact: Aviation accounts for 2.5% of global annual CO<sub>2</sub> emissions.
        </h3>
      </div>
      <StatusPoll taskID={params.id}></StatusPoll>
    </div>
  );
}

export default page;
