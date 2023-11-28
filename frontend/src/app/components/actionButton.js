'use client';

export function ActionButton({ onChange, direction = 1, className, ariaLabel, children }) {
  return (
    <button
      className={className}
      aria-label={ariaLabel}
      onClick={() => {
        onChange(direction);
      }}
      type="button"
    >
      {children}
    </button>
  );
}
