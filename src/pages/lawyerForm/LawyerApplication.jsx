import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { STEPS, STEP_FIELDS } from "./Constants"
import { Step1, Step2, Step3 } from "../../components/steps/Steps"
import StepIndicator from "../../components/steps/StepIndicator"

export default function RegisterPage() {
  const navigate = useNavigate()
  const form = useForm({ mode: "onTouched" })

  const [step, setStep] = useState(1)
  const [files, setFiles] = useState({ certificate: null })
  const [fileErrors, setFileErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState(null)

  const next = async () => {
    const isValid = await form.trigger(STEP_FIELDS[step])
    if (isValid) setStep((s) => s + 1)
  }

  const back = () => setStep((s) => s - 1)

  const onSubmit = async (data) => {
    if (!files.certificate) {
      setFileErrors({ certificate: "Practicing certificate is required" })
      return
    }

    setFileErrors({})
    setIsSubmitting(true)
    setApiError(null)

    try {
      let profile_picture_url = null
      const picData = new FormData()
      picData.append("document", data.profilePhoto)
      const picRes = await fetch("/api/documents/upload-file", { method: "POST", body: picData })
      const picResult = await picRes.json()
      if (!picRes.ok) throw new Error(picResult.error || "Failed to upload profile photo")
        profile_picture_url = picResult.fileUrl



      // upload certificate
      const certData = new FormData()
      certData.append("document", files.certificate)
      const certRes = await fetch("/api/documents/upload-file", { method: "POST", body: certData })
      const certResult = await certRes.json()
      if (!certRes.ok) throw new Error(certResult.error || "Failed to upload certificate")

      // submit application
      const appRes = await fetch("/api/lawyer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lsk_number: data.lsk_number,
          category: data.category,
          consultation_fee: parseInt(data.consultation_fee),
          experience: parseInt(data.experience),
          description: data.description,
          phone_number: data.phone_number,
          profile_picture_url,
          file_url: certResult.fileUrl,
        }),
      })

      const appResult = await appRes.json()
      if (!appRes.ok) throw new Error(appResult.error || appResult.message || "Failed to submit application")

      navigate("/application-pending")
    } catch (err) {
      setApiError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepTitle = {
    1: "Profile Setup",
    2: "Professional Credentials",
    3: "Verification Documents",
  }

  const stepSubtitle = {
    1: "Let's start with the basics — how clients will find and know you.",
    2: "Provide your legal credentials and required documentation.",
    3: "Upload the required documents to verify your professional status.",
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
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
            <h1 className="text-on-primary text-3xl font-bold tracking-tight mb-1">{stepTitle[step]}</h1>
            <p className="text-on-primary/60 text-sm">{stepSubtitle[step]}</p>
          </div>

          {/* Step indicator */}
          <div className="px-8 pt-8">
            <StepIndicator current={step} steps={STEPS} />
          </div>

          {/* API error banner */}
          {apiError && (
            <div className="mx-8 mb-4 p-4 rounded-xl bg-error-container text-on-error-container text-sm font-semibold">
              {apiError}
            </div>
          )}

          {/* Steps */}
          <div className="px-8 pb-8">
            {step === 1 && <Step1 form={form} />}
            {step === 2 && <Step2 form={form} />}
            {step === 3 && <Step3 files={files} setFiles={setFiles} fileErrors={fileErrors} />}

            {/* Navigation */}
            <div className={`flex mt-8 gap-3 ${step > 1 ? "justify-between" : "justify-end"}`}>
              {step > 1 && (
                <button
                  type="button"
                  onClick={back}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl border border-outline-variant text-on-surface text-sm font-semibold
                    hover:bg-surface-container transition-all duration-200 disabled:opacity-50"
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
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => onSubmit(form.getValues())}
                  className="bg-secondary text-on-secondary px-8 py-3 rounded-xl text-sm font-semibold
                    hover:opacity-90 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting
                    ? <>
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Submitting...
                      </>
                    : "Submit Application"
                  }
                </button>
              )}
            </div>
          </div>

        </div>

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