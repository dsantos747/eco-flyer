"use client";

const error = ({ error, reset }) => {
  return (
    <div className="text-center flex flex-col gap-3">
      <div>{error.message}</div>
      <div>
        <button className="flex-none px-2 text-center rounded-md bg-rose-50 border-2" onClick={() => reset()}>
          Retry
        </button>
      </div>
    </div>
  );
};

export default error;
