import { revalidateTag } from "next/cache";
import { emissionsError } from "@/lib/exceptions";
import { TripCard } from "../components/tripCard.js";
import { Suspense } from "react";
// import { TailSpin } from "react-loader-spinner";

export const emissionsFetch = async () => {
  const user_location = { lat: 38.7813, long: -9.13592 };
  const search_radius = 1500;

  revalidateTag("emissions"); // This is used to trigger a re-fetching of data. Figure out where best to place this
  const query_url = `http://localhost:8080/api/emissions?loc=${user_location.lat},${user_location.long}&rad=${search_radius}`;
  const result = await fetch(query_url, {
    next: { tags: ["emissions"] },
  });

  if (!result.ok) {
    throw new emissionsError();
  } else {
    return result.json();
  }
};

async function page() {
  const route_results = await emissionsFetch();
  const sorted_result = Object.fromEntries(Object.entries(route_results).sort((a, b) => a[1][0].trip_emissions - b[1][0].trip_emissions));
  const destinations = Object.keys(sorted_result); // Array used for referring to for sort order (objects may be re-ordered depending on JS compiler)

  return (
    <div>
      <Suspense fallback={<p>Loading</p>}>
        <TripCard emissions={sorted_result} destinations={destinations} option={0}></TripCard>
      </Suspense>
    </div>
  );
}

export default page;
