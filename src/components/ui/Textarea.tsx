interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Textarea({ label, error, hint, id, rows = 5, className = "", ...props }: TextareaProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  const base = "w-full border rounded-lg px-3 py-2 text-sm text-gray-900 bg-white resize-y transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
  const errorCls = error ? "border-red-400 focus:ring-red-400 focus:border-red-400" : "border-gray-300";

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea id={inputId} rows={rows} className={`${base} ${errorCls} ${className}`} {...props} />
      {error && <p className="text-red-600 text-xs">{error}</p>}
      {!error && hint && <p className="text-gray-500 text-xs">{hint}</p>}
    </div>
  );
}
