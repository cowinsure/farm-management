"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Phone, RefreshCw, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { authService, ApiError } from "@/lib/api/auth"

export default function SignupOTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()

  const phoneNumber = searchParams.get("phone") || ""

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatPhoneNumber = (phone: string) => {
    if (phone.length === 11) {
      return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`
    }
    return phone
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple characters

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)
    setError("")

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const newOtp = [...otp]

    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || ""
    }

    setOtp(newOtp)

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex((digit) => !digit)
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
    inputRefs.current[focusIndex]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpString = otp.join("")

    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit OTP")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await authService.verifyOtp({
        mobile_number: phoneNumber,
        otp: otpString,
      })

      if (response.statusCode === "200") {
        setSuccess("OTP verified successfully!")
        setTimeout(() => {
          router.push(`/auth/set-password?phone=${phoneNumber}`)
        }, 1500)
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.statusCode === "400") {
          if (error.details?.details?.non_field_errors) {
            setError(error.details.details.non_field_errors[0] || "Invalid OTP or mobile number.")
          } else {
            setError(error.details?.message || "Invalid OTP. Please try again.")
          }
        } else {
          setError(error.statusMessage || "Verification failed")
        }
      } else {
        setError("Network error. Please check your connection and try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setIsResending(true)
    setError("")
    setSuccess("")

    try {
      const response = await authService.registerStep1({
        mobile_number: phoneNumber,
        role_id: "1",
        latitude: 0,
        longitude: 0,
      })

      if (response.statusCode === "200") {
        setSuccess("OTP sent successfully!")
        setTimeLeft(120) // Reset timer
        setOtp(["", "", "", "", "", ""]) // Clear OTP inputs
        inputRefs.current[0]?.focus()
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.details?.message || "Failed to resend OTP")
      } else {
        setError("Network error. Please try again.")
      }
    } finally {
      setIsResending(false)
    }
  }

  const isOtpComplete = otp.every((digit) => digit !== "")
  const canResend = timeLeft === 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">14</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">LivestockPro ERP</h1>
          <p className="text-gray-600 mt-2">Verify your phone number</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <Link href="/auth/signup" className="text-gray-400 hover:text-gray-600">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <CardTitle>Verify OTP</CardTitle>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>Sent to {formatPhoneNumber(phoneNumber)}</span>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input */}
              <div className="space-y-2">
                <div className="flex justify-center space-x-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ""))}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-12 h-12 text-center text-lg font-semibold"
                      disabled={isLoading}
                    />
                  ))}
                </div>
                <p className="text-center text-sm text-gray-500">Enter the 6-digit code sent to your phone</p>
              </div>

              {/* Timer */}
              <div className="text-center">
                {timeLeft > 0 ? (
                  <p className="text-sm text-gray-600">
                    Resend OTP in <span className="font-semibold text-green-600">{formatTime(timeLeft)}</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isResending}
                    className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center justify-center space-x-1"
                  >
                    <RefreshCw className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`} />
                    <span>{isResending ? "Sending..." : "Resend OTP"}</span>
                  </button>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600 text-center">{success}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!isOtpComplete || isLoading}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                {"Didn't receive the code? Check your SMS or try resending after the timer expires."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
