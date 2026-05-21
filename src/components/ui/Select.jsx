export function Select({ children, ...props }) {
  return (
    <div className="relative">
      <select
        className="w-full appearance-none px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest
          text-on-surface text-sm cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container
          transition-all duration-200"
        {...props}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4.5 6.5 8 10l3.5-3.5H4.5z" />
        </svg>
      </span>
    </div>
  )
}