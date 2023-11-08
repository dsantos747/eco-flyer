import { revalidateTag } from "next/cache";
import { emissionsError } from "@/app/components/exceptions.js";
import { TripCard } from "../components/tripCard.js";
import { cookies } from "next/headers";

function getFirstTripEmissions(destination) {
  for (const option in destination) {
    if (destination.hasOwnProperty(option)) {
      return destination[option].trip_emissions;
    }
  }
}

// function normaliseDate(uglyDate) {
//   return `${uglyDate.slice(8)}-${uglyDate.slice(5, 7)}-${uglyDate.slice(0, 4)}`;
// }

export const emissionsFetch = async (latLong, outboundDate, outboundDateEndRange, returnDate, returnDateEndRange, tripLength) => {
  const baseUrl = process.env.API_URL;

  revalidateTag("emissions"); // This is used to trigger a re-fetching of data. Should trigger this only if request body has changed
  // Maybe see if there's a way of checking a cookie's age?

  let params = { lat: latLong.lat, long: latLong.long, len: tripLength };
  let paramsURL = new URLSearchParams(params);
  let query_url = `${baseUrl}/api/results/airports?${paramsURL.toString()}`;

  // FIX - Remove unnecessary params from all fetch params

  let originAirports, destinationAirports;

  try {
    const response = await fetch(query_url, {
      next: { tags: ["emissions"] },
    });
    if (response.ok) {
      const data = await response.json();
      originAirports = data.origin_airports;
      destinationAirports = data.destination_airports;
    } else {
      console.error("Error: response not Ok", response.status, response.statusText);
      throw new emissionsError();
    }
  } catch (error) {
    console.error(error);
    throw new emissionsError(); // Make a more specific error here, such as "Error getting departure location / destination airports"
  }

  let rawDestinations;
  query_url = `${baseUrl}/api/results/tequila`;
  try {
    const response = await fetch(query_url, {
      method: "POST",
      body: JSON.stringify({ originAirports, destinationAirports, outboundDate, outboundDateEndRange, returnDate, returnDateEndRange }),
      headers: { "Content-Type": "application/json" },
      next: { tags: ["emissions"] },
    });
    if (response.ok) {
      const data = await response.json();
      rawDestinations = data;
    } else {
      console.error("Error: response not Ok", response.status, response.statusText);
      throw new emissionsError();
    }
  } catch (error) {
    console.error(error);
    throw new emissionsError();
  }

  let rawEmissions;
  query_url = `${baseUrl}/api/results/emissions`;
  try {
    const response = await fetch(query_url, {
      method: "POST",
      body: JSON.stringify(rawDestinations),
      headers: { "Content-Type": "application/json" },
      next: { tags: ["emissions"] },
    });
    if (response.ok) {
      const data = await response.json();
      rawEmissions = data;
    } else {
      console.error("Error: response not Ok", response.status, response.statusText);
      throw new emissionsError();
    }
  } catch (error) {
    console.error(error);
    throw new emissionsError();
  }

  let parsedResults;
  query_url = `${baseUrl}/api/results/sort`;
  try {
    const response = await fetch(query_url, {
      method: "POST",
      body: JSON.stringify({ rawDestinations, rawEmissions }),
      headers: { "Content-Type": "application/json" },
      next: { tags: ["emissions"] },
    });
    if (response.ok) {
      const data = await response.json();
      parsedResults = data;
    } else {
      console.error("Error: response not Ok", response.status, response.statusText);
      throw new emissionsError();
    }
  } catch (error) {
    console.error(error);
    throw new emissionsError();
  }

  return parsedResults;
  // Test error throw to stop action
  // throw new emissionsError();
};

async function page() {
  // TASKS TO FIX THIS
  // I suspect the await on the emissions fetch is making the Vercel thing trip up,
  // because the "/results" redirect is seen as a serverless function
  // To fix this, see if you can maybe abstract all this data fetching to within a sub
  // component (maybe TripCard, although that's CSR), so that the page can be loaded
  // ("/results" route reached) before the data has been fetched. This will also mean
  // we need a skeleton on the TripCard.

  // Is probably worth testing out if that is the case first, by deploying to vercel a
  // modified version of this script with a much simplified fetch (or dummy data)

  const response = JSON.parse(cookies().get("request")?.value);
  const { location, outboundDate, outboundDateEndRange, returnDate, returnDateEndRange, tripLength, latLong } = response;
  // const route_results = await emissionsFetch(latLong, outboundDate, outboundDateEndRange, returnDate, returnDateEndRange, tripLength);
  const route_results = emissionsFetch(latLong, outboundDate, outboundDateEndRange, returnDate, returnDateEndRange, tripLength);
  const sorted_result = Object.fromEntries(
    Object.entries(route_results).sort((a, b) => getFirstTripEmissions(a[1]) - getFirstTripEmissions(b[1]))
  );
  const destinations = Object.keys(sorted_result); // Array used for referring to for sort order

  return (
    <div>
      <h1 className="text-4xl">This is some test text, to verify if Vercel issues are caused by await on emissionsFetch</h1>
      {/* <TripCard emissions={route_results} destinations={destinations} option={1}></TripCard> */}
    </div>
  );
}

export default page;
