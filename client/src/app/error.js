"use client";

const error = ({ error, reset }) => {
  return (
    <div>
      <div>{error.message}</div>
      <div>
        <button onClick={() => reset()}>Retry</button>
      </div>
    </div>
  );
};

export default error;
