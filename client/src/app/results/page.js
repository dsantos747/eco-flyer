import { revalidateTag } from "next/cache";
import { emissionsError } from "@/lib/exceptions";
import { TripCard } from "../components/tripCard.js";
import { cookies } from "next/headers";

export const emissionsFetch = async (latLong, outboundDate, outboundDateEndRange, returnDate, returnDateEndRange, tripLength) => {
  // const user_location = { lat: 38.7813, long: -9.13592 };

  const params = {
    lat: latLong.lat,
    long: latLong.long,
    len: tripLength,
    out: outboundDate,
    outEnd: outboundDateEndRange,
    ret: returnDate,
    retEnd: returnDateEndRange,
  };

  const paramsURL = new URLSearchParams(params);
  revalidateTag("emissions"); // This is used to trigger a re-fetching of data. Figure out where best to place this
  const query_url = `http://localhost:8080/api/emissions?${paramsURL.toString()}`;

  // const res = await fetch(query_url, {
  //   next: { tags: ["emissions"] },
  // });

  // if (!res.ok) {
  //   throw new emissionsError();
  // } else {
  //   return res.json();
  // }

  try {
    const result = await fetch(query_url, {
      next: { tags: ["emissions"] },
    });
    return result.json();
  } catch (error) {
    throw new emissionsError();
  }

  // return result.json();
};

async function page() {
  const response = JSON.parse(cookies().get("request")?.value);
  const { location, outboundDate, outboundDateEndRange, returnDate, returnDateEndRange, tripLength, latLong } = response;

  const route_results = await emissionsFetch(latLong, outboundDate, outboundDateEndRange, returnDate, returnDateEndRange, tripLength);
  const sorted_result = Object.fromEntries(Object.entries(route_results).sort((a, b) => a[1][0].trip_emissions - b[1][0].trip_emissions));
  const destinations = Object.keys(sorted_result); // Array used for referring to for sort order (objects may be re-ordered depending on JS compiler)

  return (
    <div>
      <TripCard emissions={sorted_result} destinations={destinations} option={0}></TripCard>
    </div>
  );
}

export default page;
