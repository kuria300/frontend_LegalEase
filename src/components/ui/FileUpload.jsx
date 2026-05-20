import { useRef, useState } from "react"

export function FileUpload({ label, hint, icon, required, onChange, value, error }) {
  const ref = useRef()
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) onChange(file)
  }

  return (
    <div className="flex flex-col gap-1">
      <div
        onClick={() => ref.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed
          cursor-pointer transition-all duration-200 select-none
          ${dragOver
            ? "border-primary-container bg-primary-container/10"
            : value
            ? "border-secondary bg-secondary-container/20"
            : "border-outline-variant bg-surface-container hover:border-primary-container hover:bg-surface-container-high"
          }`}
      >
        <input
          ref={ref}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => { if (e.target.files[0]) onChange(e.target.files[0]) }}
        />

        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center
          ${value ? "bg-secondary-container" : "bg-surface-container-high"}`}>
          {value
            ? <svg className="w-7 h-7 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            : <svg className="w-7 h-7 text-on-surface-variant" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {icon}
              </svg>
          }
        </div>

        <div className="text-center">
          <p className={`font-semibold text-sm ${value ? "text-secondary" : "text-on-surface"}`}>
            {value ? value.name : label}
            {required && !value && <span className="text-error ml-0.5">*</span>}
          </p>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {value ? `${(value.size / 1024).toFixed(1)} KB · Click to replace` : hint}
          </p>
        </div>
      </div>

      {error && (
        <span className="text-xs text-error flex items-center gap-1">
          <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 10.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zM7.25 5.75a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-1.5 0v-3z" />
          </svg>
          {error}
        </span>
      )}
    </div>
  )
}