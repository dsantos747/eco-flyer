import { revalidateTag } from "next/cache";
import { testError, emissionsError } from "@/lib/exceptions";

const wait = (ms = Number) => new Promise((resolve) => setTimeout(resolve, ms));

const helloWorldFetch = async () => {
  revalidateTag("helloWorld"); // This is used to trigger a re-fetching of data. Figure out where best to place this
  const result = await fetch("http://localhost:8080/api/home", { next: { tags: ["helloWorld"] } });

  if (!result.ok) {
    throw new testError();
  }

  return result.json();
};

const emissionsFetch = async () => {
  const user_location = { lat: 38.7813, long: -9.13592 };
  const search_radius = 1500;

  revalidateTag("emissions"); // This is used to trigger a re-fetching of data. Figure out where best to place this
  const query_url = `http://localhost:8080/api/emissions?loc=${user_location.lat},${user_location.long}&rad=${search_radius}`;
  const result = await fetch(query_url, {
    next: { tags: ["emissions"] },
  });

  let response = [];

  if (!result.ok) {
    throw new emissionsError();
  } else {
    return result.json();
    // let result_json = await result.json();
    // let destination = result_json["London"][0]["cityTo"];
    // let emissionsPerPerson = `${result_json["London"][0]["trip_emissions"] / 1000} kg CO2 per person`;
    // response.push(destination, emissionsPerPerson);
  }

  // return response;
};

const formatDate = (date) => {
  const year = date.slice(0, 4);
  const month = date.slice(5, 7);
  const day = date.slice(8, 10);

  return `${day}/${month}/${year}`;
};

const displayTrip = async (response) => {
  // This should display relevant information about the currently selected trip
  // I think you'll need some sort of list in the format: [emissions]["destination"][trip_no]
  // This can be sorted by emissions on the python side, then used as reference to know which trip to select from json output
  // console.log(response);
  const firstOutbound = response["flights"][0][0];
  const firstReturn = response.flights[response.flights.length - 1][0];
  return (
    <div>
      <div>From {response.cityFrom}, how about:</div>
      <div>{response.cityTo}</div>
      <div>
        Fly out {formatDate(firstOutbound.local_departure)}, return {formatDate(firstReturn.local_departure)}
      </div>
      <div>Total Emissions: {response.trip_emissions / 1000}kg CO2 per person</div>
    </div>
  );
};

async function page() {
  // await wait(1000); // Dummy call to wait , to simulate 1s loading time

  const data = await helloWorldFetch();
  const emissions = await emissionsFetch();

  const destinations = Object.keys(emissions); // FIX: Object is getting sorted. Need to manually re-sort it by emissions, using a separate array
  let currentDestination = destinations[0];
  let currentOption = 0;

  const parsedData = await displayTrip(emissions[currentDestination][currentOption]);

  return (
    <div>
      <div>{data.message}</div>
      <div>{parsedData}</div>
      {/* <div>{emissions[0]}</div>
      <div>{emissions[1]}</div> */}
    </div>
  );
}

export default page;
