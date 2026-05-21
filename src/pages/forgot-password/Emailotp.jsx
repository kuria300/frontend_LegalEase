import React, { useState, useEffect } from 'react'
import Legalease from '../../assets/images/Legalease.png'
import Button from '../../components/ui/auth/Button'
import RegisterInput from '../../components/ui/auth/RegisterInput'
import { ArrowLeft, LoaderCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const Emailotp = () => {
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    
    const [errors, setErrors] = useState('')
    const [sendingCode, setSendingCode] = useState(false)
    const [submittingReset, setSubmittingReset] = useState(false)
    const [codeSent, setCodeSent] = useState(false)

    const url = import.meta.env.VITE_SERVER_URL
    const navigate = useNavigate()

    const validateEmail = (emailStr) => {
        let regex = /^[a-zA-Z0-9.+_%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return regex.test(emailStr)
    }

    const handleSendCode = async () => {
        if (email.trim()=== '') {
            setErrors('Please enter your email address first.')
            return
        }
        if (!validateEmail(email)) {
            setErrors('Please enter a valid email address.')
            return
        }

        setErrors('')
        setSendingCode(true)

        try {
            // when if (email && !otp && !newPassword)
            const response = await axios.post(`${url}/auth/forgot-password`, { email })
            //help track if we are resending code or sending for first time
            setCodeSent(true)
            toast.success(response.data.message || 'OTP code sent! Please check your email.')
        } catch (error) {
            console.error('OTP error:', error)
            // setErrors(error.response?.data?.error || 'Failed to send OTP code.')
            toast.error(error.response?.data?.error || 'Failed to send verification code.')
        } finally {
            setSendingCode(false)
        }
    }
    //submit whole form with email, otp and new password if(email && otp && newPassword)
    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault()

        if (otp.trim().length !== 6 || isNaN(otp)) {
            setErrors('Please enter a valid 6-digit numeric verification code.')
            return
        }
        if (newPassword !== confirmPassword) {
            setErrors('Your passwords do not match.')
            return
        }

        setErrors('')
        setSubmittingReset(true)

        try {
            // Hits backend block: if (email && otp && newPassword)
            const response = await axios.post(`${url}/auth/forgot-password`, {
                email: email.trim(),
                otp: otp.trim(),
                newPassword,
                confirmPassword
            })

            toast.success(response.data.message || 'Password reset successfully!.Please Login with your new password.')
            navigate('/login')
        } catch (error) {
            console.error('Reset password failure:', error)
            // setErrors(error.response?.data?.error || 'Verification failed. The code may be incorrect or expired.')
            toast.error(error.response?.data?.error || 'Verification failed. The code may be incorrect or expired.')
        } finally {
            setSubmittingReset(false)
        }
    }

    // Button unlocks only when fields are completely filled out
    const isResetDisabled = !email.trim() || otp.trim().length !== 6 || !newPassword.trim() || !confirmPassword.trim() || submittingReset || sendingCode

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-background">
            <div className="w-full max-w-md mx-auto">
                <div className="flex items-center justify-center mb-6">
                    <img src={Legalease} alt='Logo' className='w-28 object-contain' />
                </div>
                <div className="bg-surface-container-lowest rounded-xl flex overflow-hidden shadow-md">
                    <div className="flex-1 p-8 md:p-14">
                        <div className="mb-6">
                            <h1 className="text-primary mb-2 font-medium text-3xl">Reset Password</h1>
                            <p className="text-on-surface-variant text-sm">Enter your email to receive an OTP, then fill in your new password details below.</p>
                        </div>

                        <form onSubmit={handleResetPasswordSubmit} className="flex flex-col gap-4">
                            
                            {/* Email Input field and send code btn */}
                            <div className="flex items-end gap-3 w-full">
                                <div className="flex-1">
                                <RegisterInput
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    label="Email Address"
                                    className="mb-6 mt-2 px-2 bg-surface"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                </div>
                                <Button 
                                    type="button" 
                                    onClick={handleSendCode} 
                                    disabled={sendingCode || !email}
                                    className={`relative px-4 mb-6 whitespace-nowrap text-sm rounded-lg ${!email ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    {sendingCode ? <LoaderCircle className="animate-spin " /> : (codeSent ? 'Resend Code' : 'Send Code')}
                                </Button>
                            </div>

                            {/* OTP code input 6 figures vvalidation isNan and <6 */}
                            <RegisterInput
                                type="text"
                                name="otp"
                                id="otp"
                                placeholder="Enter 6-digit code"
                                label="Verification Code (OTP)"
                                className="mt-2 px-2 bg-surface font-semibold tracking-widest text-center"
                                maxLength="6"
                                inputMode="numeric"
                                value={otp}
                                //limits to 6 and only integers
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                                required
                            />

                            {/* Row 3: New Password input fields */}
                            <RegisterInput
                                type="password"
                                name="newPassword"
                                id="newPassword"
                                placeholder="Enter new password"
                                label="New Password"
                                className="px-2 mt-2 bg-surface"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />

                            <RegisterInput
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                placeholder="Confirm new password"
                                label="Confirm Password"
                                className="px-2 mt-2 bg-surface"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            {errors && <p className="text-on-error-container text-sm mt-1">{errors}</p>}

                            {/* only unlocks after everything is filled*/}
                            <Button 
                                type="submit" 
                                disabled={isResetDisabled} 
                                className={`w-full mt-4 rounded-full ${isResetDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                {submittingReset ? <LoaderCircle className="animate-spin mx-auto" /> : 'Reset Password'}
                            </Button>

                            <div className="mt-4 pt-4 border-t border-outline-variant/30 text-center">
                                <Link to="/login"
                                    className="group text-on-surface-variant hover:text-primary text-sm flex items-center justify-center gap-2">
                                    <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
                                    Back to Login
                                </Link>
                            </div>
                        </form>

                     </div>
                 </div>
                  <div className="mt-10 text-center">
                    <p className=" text-on-surface-variant/60 text-sm mb-4">
                        © {new Date().getFullYear()} LegalEase Kenya. Empowering Justice through Technology.
                    </p>
                </div>
         </div> 

         
        </div>
        
    )
}

export default Emailotp
