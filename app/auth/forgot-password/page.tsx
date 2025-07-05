"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Phone } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const validatePhoneNumber = (phone: string) => {
    // Bangladesh phone number validation (11 digits, starts with 01)
    const phoneRegex = /^01[3-9]\d{8}$/
    return phoneRegex.test(phone)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "") // Remove non-digits
    if (value.length <= 11) {
      setPhoneNumber(value)
      if (error) {
        setError("")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!phoneNumber) {
      setError("Phone number is required")
      setIsLoading(false)
      return
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError("Please enter a valid Bangladesh phone number (11 digits, starts with 01)")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to OTP verification
      router.push(`/auth/verify-otp?phone=${phoneNumber}&type=forgot-password`)
    } catch (error) {
      setError("Failed to send OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatPhoneDisplay = (phone: string) => {
    if (phone.length >= 3) {
      return `${phone.slice(0, 3)}-${phone.slice(3)}`
    }
    return phone
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">14</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">LivestockPro ERP</h1>
          <p className="text-gray-600 mt-2">Reset your password</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <Link href="/auth/login" className="text-gray-400 hover:text-gray-600">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <CardTitle>Forgot Password</CardTitle>
            </div>
            <p className="text-sm text-gray-600">
              Enter your phone number and we'll send you an OTP to reset your password.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Phone Number Input */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={formatPhoneDisplay(phoneNumber)}
                    onChange={handlePhoneChange}
                    className={`pl-10 ${error ? "border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <p className="text-xs text-gray-500">Enter your registered 11-digit Bangladesh phone number</p>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link href="/auth/login" className="text-green-600 hover:text-green-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
