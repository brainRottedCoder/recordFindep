"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { toast } from "sonner"
import {
  EyeIcon,
  EyeSlashIcon,
  SparklesIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    
    // Check for verification success message
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('verified') === 'true') {
      toast.success("Email verified successfully! You can now log in.")
      setIsLogin(true)
    }
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-emerald-900/10 dark:to-teal-900/10 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate inputs
      if (!formData.email || !formData.password) {
        toast.error("Please fill in all required fields")
        return
      }

      if (formData.email.length < 3) {
        toast.error("Please enter a valid email address")
        return
      }

      if (formData.password.length < 1) {
        toast.error("Password is required")
        return
      }

      // Get CSRF token
      const csrfResponse = await fetch('/api/auth/csrf')
      const csrfData = await csrfResponse.json()
      const csrfToken = csrfData.token

      if (isLogin) {
        // Login
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken,
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          toast.error(data.error || 'Login failed')
          return
        }

        toast.success("Welcome back!")
        
        // Check if onboarding is complete
        const onboardingComplete = localStorage.getItem("finverse_onboarding_complete")
        if (onboardingComplete === "true") {
          router.push("/dashboard")
        } else {
          router.push("/onboarding")
        }
      } else {
        // Register
        if (!formData.name) {
          toast.error("Please enter your full name")
          return
        }

        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords don't match")
          return
        }

        if (formData.password.length < 8) {
          toast.error("Password must be at least 8 characters")
          return
        }

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken,
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          toast.error(data.error || 'Registration failed')
          return
        }

        toast.success(data.message || "Registration successful!")
        
        // Switch to login mode after successful registration
        setIsLogin(true)
        setFormData({
          name: "",
          email: formData.email, // Keep email for login
          password: "",
          confirmPassword: "",
        })
      }
    } catch (error) {
      console.error('Authentication error:', error)
      toast.error("Authentication failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = () => {
    setIsLoading(true)
    // TODO: Implement real Google OAuth
    toast.error("Google OAuth not implemented yet")
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-emerald-900/10 dark:to-teal-900/10 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-300/20 to-teal-300/20 rounded-full organic-blob animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full organic-blob animate-pulse delay-1000"></div>
      </div>

      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold">
              <span className="gradient-text">Fin</span>
              <span className="handwritten text-emerald-600">Verse</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-2">{isLogin ? "Welcome back!" : "Join FinVerse"}</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {isLogin ? "Continue your financial journey" : "Start your journey to financial freedom"}
          </p>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="glass-card border-0 shadow-2xl">
            <CardHeader className="space-y-1 pb-4">
              <div className="flex items-center justify-center gap-1">
                <Button
                  variant={isLogin ? "default" : "ghost"}
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 ${isLogin ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white" : ""}`}
                >
                  Sign In
                </Button>
                <Button
                  variant={!isLogin ? "default" : "ghost"}
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 ${!isLogin ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white" : ""}`}
                >
                  Sign Up
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Google Sign In */}
              <Button
                variant="outline"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full h-12 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required={!isLogin}
                          className="h-12"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="h-12 pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required={!isLogin}
                          className="h-12"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        id="remember"
                        type="checkbox"
                        className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <Label htmlFor="remember" className="text-sm">
                        Remember me
                      </Label>
                    </div>
                    <Button variant="link" className="px-0 text-sm text-emerald-600 hover:text-emerald-700">
                      Forgot password?
                    </Button>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {isLogin ? "Signing in..." : "Creating account..."}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {isLogin ? "Sign In" : "Create Account"}
                      <ArrowRightIcon className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Features Preview */}
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">What you'll get:</p>
                  <div className="space-y-2">
                    {[
                      { icon: SparklesIcon, text: "AI-powered financial insights" },
                      { icon: ShieldCheckIcon, text: "Bank-level security" },
                      { icon: UserPlusIcon, text: "Personalized learning paths" },
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <feature.icon className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-gray-600 dark:text-gray-300">
            By continuing, you agree to our{" "}
            <Button variant="link" className="p-0 h-auto text-sm text-emerald-600 hover:text-emerald-700">
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button variant="link" className="p-0 h-auto text-sm text-emerald-600 hover:text-emerald-700">
              Privacy Policy
            </Button>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
