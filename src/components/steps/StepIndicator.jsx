import { Fragment } from "react"

export default function StepIndicator({ current, steps }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((step, i) => {
        const done = current > step.id
        const active = current === step.id
        return (
          <Fragment key={step.id}>
            <div className="flex flex-col items-center gap-1.5">
              <div className={`
                w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold
                transition-all duration-300
                ${done
                  ? "bg-secondary text-on-secondary"
                  : active
                  ? "bg-primary-container text-on-primary ring-4 ring-primary-container/20"
                  : "bg-surface-container-high text-on-surface-variant"
                }
              `}>
                {done ? (
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                  </svg>
                ) : step.id}
              </div>
              <span className={`text-xs font-medium whitespace-nowrap ${active ? "text-on-surface" : "text-on-surface-variant"}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-24 mx-1 mb-5 rounded transition-all duration-500
                ${done ? "bg-secondary" : "bg-outline-variant"}`}
              />
            )}
          </Fragment>
        )
      })}
    </div>
  )
}