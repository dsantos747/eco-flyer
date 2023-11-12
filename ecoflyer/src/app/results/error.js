'use client';

const error = ({ error, reset }) => {
  return (
    <div className="text-center items-center flex flex-col gap-3">
      <div>Oops - an error occured 😕. Please try again.</div>

      <div>
        <button
          className="flex-none px-2 text-center rounded-md bg-rose-50 hover:bg-gray-400 active:scale-95 border-2"
          onClick={() => reset()}
        >
          Retry
        </button>
      </div>
      <div className="text-slate-600 pt-8 text-sm max-w-xl">{`Error message: ${error.message}`}</div>
    </div>
  );
};

export default error;
