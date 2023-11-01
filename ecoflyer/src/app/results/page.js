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

export const emissionsFetch = async (latLong, outboundDate, outboundDateEndRange, returnDate, returnDateEndRange, tripLength) => {
  const params = {
    lat: latLong.lat,
    long: latLong.long,
    len: tripLength,
    out: outboundDate,
    outEnd: outboundDateEndRange,
    ret: returnDate,
    retEnd: returnDateEndRange,
  };

  const baseUrl = process.env.API_URL;
  const paramsURL = new URLSearchParams(params);
  revalidateTag("emissions"); // This is used to trigger a re-fetching of data. Figure out where best to place this
  // const query_url = `http://localhost:8080/api/emissions?${paramsURL.toString()}`;
  const query_url = `https://eco-flyer.vercel.app/api/index/api/emissions?${paramsURL.toString()}`;
  // const query_url = `${baseUrl}/api/emissions?${paramsURL.toString()}`;
  console.log(`Query URL: ${query_url}`);

  // const res = await fetch(query_url, {
  //   next: { tags: ["emissions"] },
  // });

  // if (!res.ok) {
  //   throw new emissionsError();
  // } else {
  //   return res.json();
  // }

  try {
    const response = await fetch(query_url, {
      next: { tags: ["emissions"] },
    });
    if (response.ok) {
      console.log(`response ok`, response.status, response.statusText);
      return await response.json();
    } else {
      console.log("Response not Ok", response.status, response.statusText);
      console.log(`R2 is ${response.Response}`);
      console.error("Err: response not Ok", response.status, response.statusText);
    }
  } catch (error) {
    console.log(error);
    throw new emissionsError();
  }
};

async function page() {
  const response = JSON.parse(cookies().get("request")?.value);
  console.log(`Cookies parsed as ${response}`);
  const { location, outboundDate, outboundDateEndRange, returnDate, returnDateEndRange, tripLength, latLong } = response;
  console.log("About to step into emissions fetch");
  const route_results = await emissionsFetch(latLong, outboundDate, outboundDateEndRange, returnDate, returnDateEndRange, tripLength);
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
