import { FlightForm } from "../components/flightForm";

async function page() {
  return (
    // <div className="-z-20 h-full bg-gradient-to-t from-rose-100 via-sky-100 to-blue-400 ">
    // <div className="backdrop-blur-sm w-full h-full flex flex-col justify-evenly items-center">
    <div className="text-center z-0 max-w-3xl">
      <div className="px-8 md:px-0">
        <h2>We cannot afford to ignore the climate emergency.</h2>
        <h2>But this shouldn't mean we can't fly away once in a while.</h2>
        <h2>So, if it's time to get away, how about choosing the option with the smallest environmental impact?</h2>
        <h2>
          eco-flyer cleverly reviews potential holiday destinations, then presents you with the flight options with the lowest emissions.
        </h2>
      </div>

      <div className="pt-10">
        <FlightForm></FlightForm>
      </div>
    </div>
    // </div>
    // </div>
  );
}

export default page;
