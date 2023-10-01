"use client";

const error = ({ error, reset }) => {
  return (
    <div>
      <div>{error.message}</div>
      <div>
        <button onCLick={reset}>Try again</button>
      </div>
    </div>
  );
};

export default error;
