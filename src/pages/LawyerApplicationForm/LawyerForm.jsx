import React, { useState, useRef } from "react"
import { useForm } from "react-hook-form"

const SPECIALIZATIONS = [
  "Family Law",
  "Criminal Law",
  "Corporate & Commercial Law",
  "Employment & Labour Law",
  "Conveyancing & Real Estate",
  "Constitutional & Human Rights Law",
  "Intellectual Property Law",
  "Immigration Law",
  "Tax Law",
  "Litigation & Dispute Resolution",
  "Banking & Finance Law",
  "Environmental Law",
]

const STEPS = [
  { id: 1, label: "Profile Setup" },
  { id: 2, label: "Professional Details" },
  { id: 3, label: "Verification" },
]

/*  Reusable field wrapper  */
function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-on-surface">
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      {children}
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

/* Textarea input  */
function Input({ placeholder, type = "text", ...props }) {
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

function Textarea({ placeholder, rows = 4, ...props }) {
  return (
    <textarea
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest
        text-on-surface placeholder:text-on-surface-variant/50 text-sm resize-none
        focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container
        transition-all duration-200"
      {...props}
    />
  )
}

function Select({ children, ...props }) {
  return (
    <div className="relative">
      <select
        className="w-full appearance-none px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest
          text-on-surface text-sm
          focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container
          transition-all duration-200 cursor-pointer"
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

/* File upload dropzone */
function FileUpload({ label, hint, icon, required, onChange, value, error }) {
  const ref = useRef()
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) onChange(file)
  }

  return (
    <div>
      <div
        onClick={() => ref.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`
          flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed
          cursor-pointer transition-all duration-200 select-none
          ${dragOver
            ? "border-primary-container bg-primary-container/10"
            : value
            ? "border-secondary bg-secondary-container/20"
            : "border-outline-variant bg-surface-container hover:border-primary-container hover:bg-surface-container-high"
          }
        `}
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
          {value ? (
            <svg className="w-7 h-7 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-7 h-7 text-on-surface-variant" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {icon}
            </svg>
          )}
        </div>
        <div className="text-center">
          <p className={`font-semibold text-sm ${value ? "text-secondary" : "text-on-surface"}`}>
            {value ? value.name : label}{required && !value && <span className="text-error ml-0.5">*</span>}
          </p>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {value ? `${(value.size / 1024).toFixed(1)} KB · Click to replace` : hint}
          </p>
        </div>
      </div>
      {error && (
        <p className="text-xs text-error mt-1 flex items-center gap-1">
          <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 10.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zM7.25 5.75a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-1.5 0v-3z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

/*  Step indicator  */
function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((step, i) => {
        const done = current > step.id
        const active = current === step.id
        return (
          <React.Fragment key={step.id}>
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
                    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
                  </svg>
                ) : step.id}
              </div>
              <span className={`text-xs font-medium whitespace-nowrap ${active ? "text-on-surface" : "text-on-surface-variant"}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-24 mx-1 mb-5 rounded transition-all duration-500
                ${done ? "bg-secondary" : "bg-outline-variant"}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

/*  Step 1: Profile Setup  */
function Step1({ form }) {
  const { register, formState: { errors }, watch, setValue } = form
  const [preview, setPreview] = useState(null)
  const photoRef = useRef()

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setValue("profilePhoto", file)
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Profile photo */}
      <div className="flex flex-col items-center gap-3 mb-2">
        <div
          onClick={() => photoRef.current.click()}
          className="relative w-28 h-28 rounded-full cursor-pointer group"
        >
          {preview ? (
            <img src={preview} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-surface-container-high" />
          ) : (
            <div className="w-full h-full rounded-full bg-surface-container-high border-4 border-surface-container flex items-center justify-center">
              <svg className="w-10 h-10 text-on-surface-variant" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 rounded-full bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
          </div>
        </div>
        <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        <p className="text-sm text-on-surface-variant">Click to upload profile photo</p>
      </div>

      <Field label="Phone Number" required error={errors.phone?.message}>
        <div className="flex gap-2">
          <div className="flex items-center px-4 py-3 rounded-xl border border-outline-variant bg-surface-container text-sm text-on-surface-variant font-medium min-w-fit">
            🇰🇪 +254
          </div>
          <Input
            placeholder="7XX XXX XXX"
            type="tel"
            {...register("phone_number", {
              required: "Phone number is required",
              pattern: {
                value: /^[17]\d{8}$/,
                message: "Enter a valid Kenyan number (e.g. 712345678)",
              },
            })}
          />
        </div>
      </Field>

      <Field label="Bio" required error={errors.bio?.message}>
        <Textarea
          placeholder="Tell clients about your background, approach, and what makes you the right advocate for them..."
          rows={5}
          {...register("description", {
            required: "A short bio is required",
            minLength: { value: 80, message: "Bio should be at least 80 characters" },
            maxLength: { value: 600, message: "Keep bio under 600 characters" },
          })}
        />
        <span className="text-xs text-on-surface-variant self-end">
          {(watch("bio") || "").length}/600
        </span>
      </Field>
    </div>
  )
}

/*  Step 2: Professional Details  */
function Step2({ form }) {
  const { register, formState: { errors } } = form

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4">
          1. Credentials
        </h3>
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="LSK Number" required error={errors.lskNumber?.message}>
              <Input
                placeholder="e.g. P105/..."
                {...register("lsk_number", {
                  required: "LSK number is required",
                  pattern: {
                    value: /^[A-Z]\d{3,}(\/\S+)?$/i,
                    message: "Enter a valid LSK number (e.g. P105/2021)",
                  },
                })}
              />
            </Field>
            <Field label="Years of Experience" required error={errors.yearsExp?.message}>
              <Input
                placeholder="e.g. 5"
                type="number"
                {...register("experience", {
                  required: "Years of experience is required",
                  min: { value: 0, message: "Cannot be negative" },
                  max: { value: 60, message: "Please enter a realistic value" },
                })}
              />
            </Field>
          </div>

          <Field label="Primary Specialization" required error={errors.specialization?.message}>
            <Select
              {...register("category", { required: "Please select an area of practice" })}
              defaultValue=""
            >
              <option value="" disabled>Select an area of practice</option>
              {SPECIALIZATIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </Field>

          <Field label="Consultation Fee (KES/hr)" required error={errors.consultationFee?.message}>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-semibold pointer-events-none">
                KSh
              </span>
              <input
                type="number"
                placeholder="e.g. 5000"
                className="w-full pl-14 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest
                  text-on-surface placeholder:text-on-surface-variant/50 text-sm
                  focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container
                  transition-all duration-200"
                {...register("consultation_fee", {
                  required: "Consultation fee is required",
                  min: { value: 500, message: "Minimum fee is KSh 500" },
                })}
              />
            </div>
          </Field>
        </div>
      </div>


    </div>
  )
}

/*  Step 3: Verification Documents  */
function Step3({ form, files, setFiles }) {
  const { formState: { errors } } = form

  const setFile = (key) => (file) => setFiles((prev) => ({ ...prev, [key]: file }))

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-surface-container rounded-2xl p-4 flex gap-3 text-sm text-on-surface-variant">
        <svg className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <p>Supported formats: <strong>PDF, JPG, PNG</strong>. Max size: <strong>5 MB</strong> per file. All documents are reviewed within 2–3 business days.</p>
      </div>

      <FileUpload
        label="Upload Practicing Certificate"
        hint="Click to browse or drag and drop"
        required
        value={files.certificate}
        onChange={setFile("certificate")}
        error={!files.certificate && errors._filesCertificate?.message}
        icon={
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        }
      />
    </div>
  )
}

/*  Success screen  */
function SuccessScreen({ onReset }) {
  return (
    <div className="flex flex-col items-center text-center gap-6 py-12">
      <div className="w-20 h-20 rounded-full bg-secondary-container flex items-center justify-center">
        <svg className="w-10 h-10 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-on-surface mb-2">Application Submitted!</h2>
        <p className="text-on-surface-variant max-w-sm">
          Your professional credentials have been received. Our team will review your application within 2–3 business days and notify you via email.
        </p>
      </div>
      <button
        onClick={onReset}
        className="btn-sign mt-2"
      >
        Back to Homepage.
      </button>
    </div>
  )
}

/*  Main form  */
export default function LawyerApplicationForm() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [files, setFiles] = useState({ certificate: null })
  const [fileErrors, setFileErrors] = useState({})

  const form = useForm({ mode: "onTouched" })

  const next = async () => {
    const fields = {
      1: ["phone_number", "description"],
      2: ["lsk_number", "experience", "category", "consultation_fee"],
    }
    const valid = await form.trigger(fields[step])
    if (valid) setStep((s) => s + 1)
  }

  const back = () => setStep((s) => s - 1)

  const onSubmit = (data) => {
    const errs = {}
    if (!files.certificate) errs.certificate = "Practicing certificate is required"
    if (Object.keys(errs).length) {
      setFileErrors(errs)
      return
    }
    console.log({ formData: data, files })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="bg-surface-container-lowest rounded-3xl shadow-lg border border-outline-variant/40 w-full max-w-xl p-8 md:p-12">
          <SuccessScreen onReset={() => { setSubmitted(false); setStep(1); form.reset(); setFiles({ certificate: null }) }} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">

        {/* Card */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-lg border border-outline-variant/40 overflow-hidden">

          {/* Header */}
          <div className="bg-primary px-8 pt-10 pb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-7 h-7 rounded-lg bg-on-primary/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-on-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
                </svg>
              </div>
              <span className="text-on-primary/60 text-sm font-medium tracking-wide">LegalEase</span>
            </div>
            <h1 className="text-on-primary text-3xl font-bold tracking-tight mb-1">
              {step === 1 ? "Profile Setup" : step === 2 ? "Professional Credentials" : "Verification Documents"}
            </h1>
            <p className="text-on-primary/60 text-sm">
              {step === 1
                ? "Let's start with the basics — how clients will find and know you."
                : step === 2
                ? "Provide your legal credentials and required documentation."
                : "Upload the required documents to verify your professional status."}
            </p>
          </div>

          {/* Step indicator */}
          <div className="px-8 pt-8">
            <StepIndicator current={step} />
          </div>

          {/* Form body */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-8 pb-8">
            {step === 1 && <Step1 form={form} />}
            {step === 2 && <Step2 form={form} />}
            {step === 3 && <Step3 form={form} files={files} setFiles={setFiles} />}

            {/* File errors */}
            {step === 3 && fileErrors.certificate && (
              <div className="mt-4 p-4 rounded-xl bg-error-container text-on-error-container text-sm flex gap-2">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 10.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zM7.25 5.75a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-1.5 0v-3z" />
                </svg>
                <span>{fileErrors.certificate}</span>
              </div>
            )}

            {/* Navigation */}
            <div className={`flex mt-8 gap-3 ${step > 1 ? "justify-between" : "justify-end"}`}>
              {step > 1 && (
                <button
                  type="button"
                  onClick={back}
                  className="px-6 py-3 rounded-xl border border-outline-variant text-on-surface text-sm font-semibold
                    hover:bg-surface-container transition-all duration-200"
                >
                  ← Back
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={next}
                  className="btn-sign px-8 py-3 rounded-xl text-sm font-semibold"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-secondary text-on-secondary px-8 py-3 rounded-xl text-sm font-semibold
                    hover:opacity-90 transition-all duration-200"
                >
                  Submit Application
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-on-surface-variant mt-6">
          By submitting, you agree to LegalEase's{" "}
          <span className="underline cursor-pointer hover:text-secondary transition-colors">Terms of Service</span>{" "}
          and{" "}
          <span className="underline cursor-pointer hover:text-secondary transition-colors">Privacy Policy</span>.
        </p>
      </div>
    </div>
  )
}