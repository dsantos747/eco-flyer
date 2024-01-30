import { FlightForm } from '../components/flightForm';
import { major } from '../fonts';

async function page() {
  return (
    <div className='text-center z-0 max-w-3xl pt-6'>
      <h1 className={`text-2xl md:text-4xl ${major.className}`}>We cannot afford to ignore the climate emergency</h1>
      <p className='hidden' aria-hidden>
        Eco-Flyer is a tool for choosing a holiday with the environment in mind. If you're flexible on your destination, and would like to
        ensure your flight emissions are minimised, this is the tool for you. Using a flights emissions model, it evaluates several flight
        options avaialable for your search parameters, and presents you with options sorted by their relative travel impact.
      </p>
      <div className='px-8 max-w-xl py-4 mx-auto'>
        <h2>
          This shouldn&apos;t mean we can&apos;t fly away once in a while. How about choosing a holiday with the smallest environmental
          impact?
        </h2>
        <h2>
          <strong>eco-flyer</strong> cleverly reviews potential holiday destinations, then presents you with the flight options with the
          lowest emissions.
        </h2>
      </div>
      <div className='pt-4'>
        <FlightForm></FlightForm>
      </div>
    </div>
  );
}

export default page;
