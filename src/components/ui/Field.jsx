export function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-on-surface">
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <span className="text-xs text-error flex items-center gap-1 mt-0.5">
          <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 10.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zM7.25 5.75a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-1.5 0v-3z" />
          </svg>
          {error}
        </span>
      )}
    </div>
  )
}