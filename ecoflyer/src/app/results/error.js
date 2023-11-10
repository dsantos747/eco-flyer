'use client';

const error = ({ error, reset }) => {
  return (
    <div className="text-center flex flex-col gap-3">
      <div>An error occured 😕 Please try again.</div>

      <div>
        <button className="flex-none px-2 text-center rounded-md bg-rose-50 border-2" onClick={() => reset()}>
          Retry
        </button>
      </div>
      <div className="text-slate-800 pt-8 text-sm">{error.message}</div>
    </div>
  );
};

export default error;
