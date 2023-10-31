import { Header } from "../components/header";
import { VapourTrails } from "../components/vapourTrails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane } from "@fortawesome/free-solid-svg-icons";

const loading = () => {
  return (
    // <div>
    // {/* <VapourTrails></VapourTrails> */}
    <div className="flex  justify-center text-center items-center p-4">
      {/* bg-gradient-to-t from-rose-100 via-sky-100 to-blue-400 */}
      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-2xlfont-bold">Please wait while we fetch you your personalised travel suggestions.</h3>
        </div>
        <div className="flex flex-col gap-6 items-center animate-spin-slow">
          <FontAwesomeIcon icon={faPlane} className="text-xl text-rose-200" />
          <FontAwesomeIcon icon={faPlane} className="rotate-180 text-xl text-rose-200" />
        </div>
        <div>
          <h3 className="text-2xlfont-bold">Did you know: Aviation accounts for 2.5% of global annual CO2 emissions.</h3>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default loading;
