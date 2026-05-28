import { useState, useRef } from "react"
import { Field } from "../ui/Field"
import { Textarea } from "../ui/Textarea"
import { Input } from "../ui/Input"
import { Select } from "../ui/Select"
import { SPECIALIZATIONS } from "../../pages/lawyerForm/Constants"
import { FileUpload } from "../ui/FileUpload"

export function Step1({ form }) {
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
      <div className="flex flex-col items-center gap-2 mb-2">
        <div onClick={() => photoRef.current.click()} className="relative w-28 h-28 rounded-full cursor-pointer group">
          {preview
            ? <img src={preview} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-surface-container-high" />
            : <div className="w-full h-full rounded-full bg-surface-container-high border-4 border-surface-container flex items-center justify-center">
                <svg className="w-10 h-10 text-on-surface-variant" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
          }
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

      <Field label="Phone Number" required error={errors.phone_number?.message}>
        <div className="flex gap-2">
          <div className="flex items-center px-4 py-3 rounded-xl border border-outline-variant bg-surface-container text-sm text-on-surface-variant font-medium min-w-fit">
            🇰🇪 +254
          </div>
          <Input
            type="tel"
            placeholder="7XX XXX XXX"
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

      <Field label="Bio" required error={errors.description?.message}>
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
          {(watch("description") || "").length}/600
        </span>
      </Field>

    </div>
  )
}



export function Step2({ form }) {
  const { register, formState: { errors } } = form

  return (
    <div className="flex flex-col gap-5">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="LSK Number" required error={errors.lsk_number?.message}>
          <Input
            placeholder="e.g. P105/2021"
            {...register("lsk_number", {
              required: "LSK number is required",
              pattern: {
                value: /^[A-Z]\d{3,}(\/\S+)?$/i,
                message: "Enter a valid LSK number (e.g. P105/2021)",
              },
            })}
          />
        </Field>

        <Field label="Years of Experience" required error={errors.experience?.message}>
          <Input
            type="number"
            placeholder="e.g. 5"
            {...register("experience", {
              required: "Years of experience is required",
              min: { value: 0, message: "Cannot be negative" },
              max: { value: 60, message: "Please enter a realistic value" },
            })}
          />
        </Field>
      </div>

      <Field label="Primary Specialization" required error={errors.category?.message}>
        <Select
          defaultValue=""
          {...register("category", { required: "Please select an area of practice" })}
        >
          <option value="" disabled>Select an area of practice</option>
          {SPECIALIZATIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </Field>

      <Field label="Consultation Fee (KES/30min)" required error={errors.consultation_fee?.message}>
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
  )
}



export function Step3({ files, setFiles, fileErrors }) {
  const setFile = (key) => (file) => setFiles((prev) => ({ ...prev, [key]: file }))

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-3 p-4 rounded-2xl bg-surface-container text-sm text-on-surface-variant">
        <svg className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <p>Supported formats: <strong>PDF, JPG, PNG</strong>. Max size: <strong>5 MB</strong> per file.</p>
      </div>

      <FileUpload
        label="Upload Practicing Certificate"
        hint="Click to browse or drag and drop"
        required
        value={files.certificate}
        onChange={setFile("certificate")}
        error={fileErrors?.certificate}
        icon={
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        }
      />
    </div>
  )
}