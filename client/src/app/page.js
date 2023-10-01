import { revalidateTag } from "next/cache";
import { testError } from "@/lib/exceptions";

const wait = (ms = Number) => new Promise((resolve) => setTimeout(resolve, ms));

const emissionsFetch = async () => {
  const result = await fetch("POST https://travelimpactmodel.googleapis.com/v1/flights:computeFlightEmissions", {
    next: { tags: ["emissions"] },
  });

  if (!result.ok) {
    throw new emissionsError();
  }

  return result.json();
};

const helloWorldFetch = async () => {
  revalidateTag("helloWorld"); // This is used to trigger a re-fetching of data. Figure out where best to place this
  const result = await fetch("http://localhost:8080/api/home", { next: { tags: ["helloWorld"] } });

  if (!result.ok) {
    throw new testError();
  }

  return result.json();
};

async function page() {
  await wait(1000); // Dummy call to wait , to simulate 5s loading time
  console.log("a");
  console.log("a");
  console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa");
  console.log("a");
  console.log("a");
  console.log(emissionsFetch());
  console.log("a");
  console.log("a");
  console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
  console.log("a");
  console.log("a");
  const data = await helloWorldFetch();

  return <div>{data.message}</div>;
}

export default page;
