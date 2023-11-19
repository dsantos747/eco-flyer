import { FlightForm } from '../components/flightForm';
import { major } from '../fonts';

const testFetch = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  let query_url = `${baseUrl}/api/ping`;
  const data = await fetch(query_url);
  let response = 'no valid response';
  if (data.ok) {
    response = await data.json();
  } else {
    response = 'failed';
  }
  return response;
};

async function page() {
  // const test = testFetch();
  return (
    <div className="text-center z-0 max-w-3xl pt-6">
      <h1 className={`text-2xl md:text-4xl ${major.className}`}>We cannot afford to ignore the climate emergency</h1>
      <div className="px-8 max-w-xl py-4 mx-auto">
        <h2>
          This shouldn&apos;t mean we can&apos;t fly away once in a while. How about choosing a holiday with the smallest environmental
          impact?
        </h2>
        <h2>
          <strong>eco-flyer</strong> cleverly reviews potential holiday destinations, then presents you with the flight options with the
          lowest emissions.
        </h2>
        {/* <h2>{test}</h2> */}
      </div>

      <div className="pt-4">
        <FlightForm></FlightForm>
      </div>
      {/* <Link href="/results" className="p-2 bg-lime-500">
        Test Link to Results
      </Link> */}
    </div>
  );
}

export default page;
