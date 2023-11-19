"use client";

export function ActionButton({ onChange, direction = 1, className, children }) {
  return (
    <button
      className={className}
      onClick={() => {
        onChange(direction);
      }}
    >
      {children}
    </button>
  );
}
