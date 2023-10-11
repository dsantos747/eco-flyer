import Link from "next/link";
import { FlightForm } from "./flightForm";

async function page() {
  return (
    <div className="flex justify-evenly items-center flex-col h-screen bg-gradient-to-t from-rose-100 via-sky-100 to-cyan-50">
      <div className="py-8 text-center">
        <h2>We cannot afford to ignore the climate emergency.</h2>
        <h2>But this doesn't mean we can't go on holiday once in a while.</h2>
        <h2>If you're dead set on flying, how about you let us give you some suggestions?</h2>
        <h2>soyouwantto.fly reviews potential holiday destinations, and presents you with the flight options with the lowest emissions.</h2>
        <div className="pt-10">
          <FlightForm></FlightForm>
        </div>
      </div>
    </div>
  );
}

export default page;
