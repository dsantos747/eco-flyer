import { FlightForm } from '../components/flightForm';
import { major } from '../fonts';

async function page() {
  return (
    <div className="text-center z-0 max-w-3xl pt-6">
      <h1 className={`text-2xl md:text-4xl ${major.className}`}>We cannot afford to ignore the climate emergency</h1>
      <div className="px-8 max-w-xl py-4 mx-auto">
        <h2>
          This shouldn&apos;t mean we can&apos;t fly away once in a while. How about choosing a holiday with the smallest environmental
          impact?
        </h2>
        <h2>
          <strong>eco-flyer</strong> cleverly reviews potential holiday destinations, then presents you with the flight options with the
          lowest emissions.
        </h2>
      </div>
      <div className="pt-4">
        <FlightForm></FlightForm>
      </div>
    </div>
  );
}

export default page;
