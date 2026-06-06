import Spinner from "./Spinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  loading?: boolean;
  loadingText?: string;
}

const variants = {
  primary:   "bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50",
  secondary: "border border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-50 disabled:opacity-50",
  ghost:     "text-gray-600 hover:text-indigo-600 hover:bg-gray-50 disabled:opacity-50",
  danger:    "text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2 text-sm rounded-lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  loadingText,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      aria-busy={loading}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 active:scale-[0.98] cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {loading && loadingText ? loadingText : children}
    </button>
  );
}
