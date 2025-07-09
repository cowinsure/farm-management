"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Phone, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authService, ApiError, type LoginRequest } from "@/lib/api/auth"
import { AuthGuard } from "@/components/auth-guard"

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ phone?: string; password?: string; general?: string }>({})
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
      if (errors.phone) {
        setErrors({ ...errors, phone: undefined })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // Validation
    const newErrors: { phone?: string; password?: string } = {}

    if (!phoneNumber) {
      newErrors.phone = "Phone number is required"
    } else if (!validatePhoneNumber(phoneNumber)) {
      newErrors.phone = "Please enter a valid Bangladesh phone number (11 digits, starts with 01)"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      const loginData: LoginRequest = {
        mobile_number: phoneNumber,
        password: password,
      }

      const response = await authService.login(loginData)

      if (response.statusCode === "200" && response.data) {
        // Save authentication data
        authService.saveAuthData(response.data)

        // Redirect to dashboard
        router.push("/")
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.statusCode === "500" && error.details?.message?.includes("Invalid mobile number or password")) {
          setErrors({ general: "Invalid phone number or password. Please try again." })
        } else {
          setErrors({ general: error.details?.message || error.statusMessage || "Login failed" })
        }
      } else {
        setErrors({ general: "Network error. Please check your connection and try again." })
      }
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
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">14</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">LivestockPro ERP</h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">Welcome Back</CardTitle>
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
                      value={(phoneNumber)}
                      onChange={handlePhoneChange}
                      className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                  <p className="text-xs text-gray-500">Enter your 11-digit Bangladesh phone number</p>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (errors.password) {
                          setErrors({ ...errors, password: undefined })
                        }
                      }}
                      className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                </div>

                {/* General Error */}
                {errors.general && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{errors.general}</p>
                  </div>
                )}

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link href="/auth/forgot-password" className="text-sm text-green-600 hover:text-green-700">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {"Don't have an account? "}
                  <Link href="/auth/signup" className="text-green-600 hover:text-green-700 font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
