<<<<<<<< HEAD:ecoflyer/src/app/(results)/results/[id]/loading.js
import { HeaderSmall } from '../../../components/header';
import { VapourTrails } from '../../../components/vapourTrails';
========
>>>>>>>> dev:frontend/src/app/(results)/results/[id]/loading.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons';

const loading = () => {
  return (
    <div className="flex justify-center text-center items-center p-4">
      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-lg">Please wait while we prepare your personalised travel suggestions.</h3>
        </div>
        <div className="flex flex-col gap-6 items-center animate-spin-slow">
          <FontAwesomeIcon icon={faPlane} className="text-xl text-rose-200" />
          <FontAwesomeIcon icon={faPlane} className="rotate-180 text-xl text-rose-200" />
        </div>
        <div>
          <h3 className="text-md italic text-slate-600 pt-6">
            Fact: Aviation accounts for 2.5% of global annual CO<sub>2</sub> emissions.
          </h3>
        </div>
      </div>
    </div>
  );
};

export default loading;
