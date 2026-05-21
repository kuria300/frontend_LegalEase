export function Input({ type = "text", placeholder, ...props }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest
        text-on-surface placeholder:text-on-surface-variant/50 text-sm
        focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container
        transition-all duration-200"
      {...props}
    />
  )
}