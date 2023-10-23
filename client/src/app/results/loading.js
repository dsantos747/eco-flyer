import { Header } from "../components/header";
import { VapourTrails } from "../components/vapourTrails";

const loading = () => {
  return (
    <div>
      <VapourTrails></VapourTrails>
      <div className="flex h-screen bg-gradient-to-t from-rose-100 via-sky-100 to-blue-400 justify-center text-center items-center py-4 gap-3">
        <div>
          <div>
            <h3 className="text-2xlfont-bold">Please wait while we fetch you your personalised travel suggestions.</h3>
          </div>
          <div>
            <h4 className="text-2xlfont-bold">Did you know: Aviation accounts for 2.5% of global annual CO2 emissions.</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default loading;
