import { FlightForm } from '../components/flightForm';
import { major } from '../fonts';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { createRequestCookies } from '../components/cookieBaker';

// async function testCookies() {
//   const requestObj = {
//     'location': 'Agualva-Cacém, Lisbon, Portugal',
//     'latLong': {
//       'lat': 38.702,
//       'long': -9.3997,
//     },
//     'outboundDate': '2023-11-08',
//     'outboundDateEndRange': '2023-11-10',
//     'returnDate': '2023-11-13',
//     'returnDateEndRange': '2023-11-15',
//     'tripLength': 'trip-medium',
//   };
//   createRequestCookies(requestObj);
//   // const requestData = JSON.stringify(requestObj);
//   // cookies().set('request', requestData);
// }

async function page() {
  // testCookies();

  return (
    // <div className="-z-20 h-full bg-gradient-to-t from-rose-100 via-sky-100 to-blue-400 ">
    // <div className="backdrop-blur-sm w-full h-full flex flex-col justify-evenly items-center">
    <div className="text-center z-0 max-w-3xl pt-6">
      <h1 className={`text-2xl md:text-4xl ${major.className}`}>We cannot afford to ignore the climate emergency.</h1>
      <div className="px-8 md:px-12 py-4">
        <h2>
          This shouldn&apos;t mean we can&apos;t fly away once in a while. How about choosing a holiday with the smallest environmental
          impact?
        </h2>
        {/* <h2>So, if it's time to get away, how about choosing the option with the smallest environmental impact?</h2> */}
        <h2>
          eco-flyer cleverly reviews potential holiday destinations, then presents you with the flight options with the lowest emissions.
        </h2>
      </div>

      <div className="pt-4">
        <FlightForm></FlightForm>
      </div>
      {/* This LINK is temporary, to test stupid Vercel */}
      <Link href="/results" className="text-md bg-green-500 p-2">
        Test button
      </Link>
    </div>
    // </div>
    // </div>
  );
}

export default page;
