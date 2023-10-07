import Link from "next/link";
import { FlightForm } from "./flightForm";

async function page() {
  async function onSubmit(event) {}

  return (
    <div className="flex justify-center items-center justify-items-center flex-col">
      <div className="flex-col py-8">
        <h2>We cannot afford to ignore the climate emergency.</h2>
        <h2>But this doesn't mean we can't go on holiday once in a while.</h2>
        <h2>If you're dead set on flying, how about you let us give you some suggestions?</h2>
        <h2>soyouwantto.fly reviews potential holiday destinations, and presents you with the flight options with the lowest emissions.</h2>
      </div>
      <div>
        <FlightForm></FlightForm>
      </div>
      <div className="h-10 px-2 text-center rounded-md font-semibold bg-blue-400 text-rose-200">
        <Link href="/results">Get Flight Results</Link>
      </div>
    </div>
  );
}

export default page;
