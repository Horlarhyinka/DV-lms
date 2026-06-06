interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizes = { sm: 16, md: 24, lg: 40 };

export default function Spinner({ size = "md", label = "Loading…" }: SpinnerProps) {
  const px = sizes[size];
  return (
    <span role="status" className="inline-flex items-center justify-center text-indigo-600">
      <svg
        width={px}
        height={px}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        className="animate-spin"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" strokeOpacity={0.25} />
        <path d="M12 2a10 10 0 0 1 10 10" />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}
