"use client";

export function ActionButton({ onChange, direction = 1, children }) {
  return (
    <button
      onClick={() => {
        onChange(direction);
      }}
    >
      {children}
    </button>
  );
}
