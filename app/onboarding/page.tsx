"use client"

import React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  HomeIcon,
  AcademicCapIcon,
  HeartIcon,
  TruckIcon,
  SparklesIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline"

interface FinancialData {
  // Personal Info
  monthlyIncome: string
  occupation: string
  age: string

  // Expenses
  housing: string
  food: string
  transportation: string
  utilities: string
  healthcare: string
  entertainment: string
  shopping: string
  education: string
  other: string

  // Savings Goals
  emergencyFund: { current: string; target: string; name: string }
  goal1: { current: string; target: string; name: string }
  goal2: { current: string; target: string; name: string }

  // Investment Experience
  investmentExperience: string
  riskTolerance: string

  // Current Assets
  savings: string
  investments: string
  debt: string
}

const steps = [
  {
    id: 1,
    title: "Personal Information",
    description: "Tell us about yourself",
    icon: CurrencyDollarIcon,
  },
  {
    id: 2,
    title: "Monthly Expenses",
    description: "Break down your spending",
    icon: ShoppingBagIcon,
  },
  {
    id: 3,
    title: "Savings Goals",
    description: "What are you saving for?",
    icon: ChartBarIcon,
  },
  {
    id: 4,
    title: "Investment Profile",
    description: "Your investment preferences",
    icon: SparklesIcon,
  },
]

const expenseCategories = [
  { key: "housing", label: "Housing & Rent", icon: HomeIcon, placeholder: "₹15,000" },
  { key: "food", label: "Food & Dining", icon: HeartIcon, placeholder: "₹8,000" },
  { key: "transportation", label: "Transportation", icon: TruckIcon, placeholder: "₹5,000" },
  { key: "utilities", label: "Utilities & Bills", icon: SparklesIcon, placeholder: "₹3,000" },
  { key: "healthcare", label: "Healthcare", icon: HeartIcon, placeholder: "₹2,000" },
  { key: "entertainment", label: "Entertainment", icon: SparklesIcon, placeholder: "₹4,000" },
  { key: "shopping", label: "Shopping", icon: ShoppingBagIcon, placeholder: "₹6,000" },
  { key: "education", label: "Education", icon: AcademicCapIcon, placeholder: "₹2,000" },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<{ name: string } | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState<FinancialData>({
    monthlyIncome: "",
    occupation: "",
    age: "",
    housing: "",
    food: "",
    transportation: "",
    utilities: "",
    healthcare: "",
    entertainment: "",
    shopping: "",
    education: "",
    other: "",
    emergencyFund: { current: "", target: "", name: "Emergency Fund" },
    goal1: { current: "", target: "", name: "" },
    goal2: { current: "", target: "", name: "" },
    investmentExperience: "",
    riskTolerance: "",
    savings: "",
    investments: "",
    debt: "",
  })

  useEffect(() => {
    setMounted(true)

    // Check authentication
    const authStatus = localStorage.getItem("finverse_auth")
    const userData = localStorage.getItem("finverse_user")
    const onboardingComplete = localStorage.getItem("finverse_onboarding_complete")

    if (authStatus !== "true") {
      router.push("/auth")
      return
    }

    if (onboardingComplete === "true") {
      router.push("/dashboard")
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof FinancialData] as any),
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const calculateTotalExpenses = () => {
    const expenseFields = [
      "housing",
      "food",
      "transportation",
      "utilities",
      "healthcare",
      "entertainment",
      "shopping",
      "education",
      "other",
    ]
    return expenseFields.reduce((total, field) => {
      const value = Number.parseFloat(formData[field as keyof FinancialData] as string) || 0
      return total + value
    }, 0)
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    // Simulate API call to save data
    setTimeout(() => {
      // Store financial data
      localStorage.setItem("finverse_financial_data", JSON.stringify(formData))
      localStorage.setItem("finverse_onboarding_complete", "true")

      setIsLoading(false)
      router.push("/dashboard")
    }, 2000)
  }

  const progress = (currentStep / steps.length) * 100

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-900/20 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
          <span className="text-lg font-medium">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-emerald-900/10 dark:to-teal-900/10">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-300/20 to-teal-300/20 rounded-full organic-blob animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full organic-blob animate-pulse delay-1000"></div>
      </div>

      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
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
          <h1 className="text-3xl font-bold mb-2">
            Welcome to FinVerse, <span className="handwritten gradient-text">{user.name.split(" ")[0]}</span>! 🎉
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Let's set up your financial profile to provide personalized insights and recommendations
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-300">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-3" />

          {/* Step Indicators */}
          <div className="flex justify-between mt-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    currentStep >= step.id
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                  }`}
                >
                  {currentStep > step.id ? <CheckCircleIcon className="w-6 h-6" /> : <step.icon className="w-6 h-6" />}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 hidden sm:block">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form Content */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="glass-card border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {React.createElement(steps.find((s) => s.id === currentStep)!.icon, {
                      className: "w-6 h-6 text-emerald-600",
                    })}
                    {steps.find((s) => s.id === currentStep)?.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="monthlyIncome">Monthly Income *</Label>
                          <Input
                            id="monthlyIncome"
                            type="number"
                            placeholder="₹50,000"
                            value={formData.monthlyIncome}
                            onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age"
                            type="number"
                            placeholder="25"
                            value={formData.age}
                            onChange={(e) => handleInputChange("age", e.target.value)}
                            className="h-12"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="occupation">Occupation</Label>
                        <Select
                          value={formData.occupation}
                          onValueChange={(value) => handleInputChange("occupation", value)}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select your occupation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="software-engineer">Software Engineer</SelectItem>
                            <SelectItem value="teacher">Teacher</SelectItem>
                            <SelectItem value="doctor">Doctor</SelectItem>
                            <SelectItem value="business-owner">Business Owner</SelectItem>
                            <SelectItem value="consultant">Consultant</SelectItem>
                            <SelectItem value="freelancer">Freelancer</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="savings">Current Savings</Label>
                          <Input
                            id="savings"
                            type="number"
                            placeholder="₹1,00,000"
                            value={formData.savings}
                            onChange={(e) => handleInputChange("savings", e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="investments">Current Investments</Label>
                          <Input
                            id="investments"
                            type="number"
                            placeholder="₹50,000"
                            value={formData.investments}
                            onChange={(e) => handleInputChange("investments", e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="debt">Total Debt</Label>
                          <Input
                            id="debt"
                            type="number"
                            placeholder="₹20,000"
                            value={formData.debt}
                            onChange={(e) => handleInputChange("debt", e.target.value)}
                            className="h-12"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Monthly Expenses */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <p className="text-gray-600 dark:text-gray-300">
                          Break down your monthly expenses to help us understand your spending patterns
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {expenseCategories.map((category) => (
                          <div key={category.key} className="space-y-2">
                            <Label htmlFor={category.key} className="flex items-center gap-2">
                              {React.createElement(category.icon, { className: "w-4 h-4 text-emerald-600" })}
                              {category.label}
                            </Label>
                            <Input
                              id={category.key}
                              type="number"
                              placeholder={category.placeholder}
                              value={formData[category.key as keyof FinancialData] as string}
                              onChange={(e) => handleInputChange(category.key, e.target.value)}
                              className="h-12"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="other">Other Expenses</Label>
                        <Input
                          id="other"
                          type="number"
                          placeholder="₹2,000"
                          value={formData.other}
                          onChange={(e) => handleInputChange("other", e.target.value)}
                          className="h-12"
                        />
                      </div>

                      {/* Expense Summary */}
                      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Total Monthly Expenses:</span>
                          <span className="text-2xl font-bold gradient-text">
                            ₹{calculateTotalExpenses().toLocaleString()}
                          </span>
                        </div>
                        {formData.monthlyIncome && (
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            Savings Rate:{" "}
                            {(
                              ((Number.parseFloat(formData.monthlyIncome) - calculateTotalExpenses()) /
                                Number.parseFloat(formData.monthlyIncome)) *
                              100
                            ).toFixed(1)}
                            %
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Savings Goals */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <p className="text-gray-600 dark:text-gray-300">
                          Set up your savings goals to track your progress and stay motivated
                        </p>
                      </div>

                      {/* Emergency Fund */}
                      <div className="p-6 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">🛡️ Emergency Fund</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Current Amount</Label>
                            <Input
                              type="number"
                              placeholder="₹50,000"
                              value={formData.emergencyFund.current}
                              onChange={(e) => handleInputChange("emergencyFund.current", e.target.value)}
                              className="h-12"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Target Amount</Label>
                            <Input
                              type="number"
                              placeholder="₹3,00,000"
                              value={formData.emergencyFund.target}
                              onChange={(e) => handleInputChange("emergencyFund.target", e.target.value)}
                              className="h-12"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Goal 1 */}
                      <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                        <h3 className="text-lg font-semibold mb-4">🎯 Savings Goal 1</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Goal Name</Label>
                            <Input
                              placeholder="e.g., Vacation to Japan, New Car, Wedding"
                              value={formData.goal1.name}
                              onChange={(e) => handleInputChange("goal1.name", e.target.value)}
                              className="h-12"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Current Amount</Label>
                              <Input
                                type="number"
                                placeholder="₹20,000"
                                value={formData.goal1.current}
                                onChange={(e) => handleInputChange("goal1.current", e.target.value)}
                                className="h-12"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Target Amount</Label>
                              <Input
                                type="number"
                                placeholder="₹2,00,000"
                                value={formData.goal1.target}
                                onChange={(e) => handleInputChange("goal1.target", e.target.value)}
                                className="h-12"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Goal 2 */}
                      <div className="p-6 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                        <h3 className="text-lg font-semibold mb-4">🚀 Savings Goal 2</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Goal Name</Label>
                            <Input
                              placeholder="e.g., House Down Payment, Business Investment"
                              value={formData.goal2.name}
                              onChange={(e) => handleInputChange("goal2.name", e.target.value)}
                              className="h-12"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Current Amount</Label>
                              <Input
                                type="number"
                                placeholder="₹10,000"
                                value={formData.goal2.current}
                                onChange={(e) => handleInputChange("goal2.current", e.target.value)}
                                className="h-12"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Target Amount</Label>
                              <Input
                                type="number"
                                placeholder="₹5,00,000"
                                value={formData.goal2.target}
                                onChange={(e) => handleInputChange("goal2.target", e.target.value)}
                                className="h-12"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Investment Profile */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <p className="text-gray-600 dark:text-gray-300">
                          Help us understand your investment preferences to provide better recommendations
                        </p>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label>Investment Experience</Label>
                          <Select
                            value={formData.investmentExperience}
                            onValueChange={(value) => handleInputChange("investmentExperience", value)}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select your experience level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner - New to investing</SelectItem>
                              <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                              <SelectItem value="advanced">Advanced - Experienced investor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Risk Tolerance</Label>
                          <Select
                            value={formData.riskTolerance}
                            onValueChange={(value) => handleInputChange("riskTolerance", value)}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="How comfortable are you with investment risk?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="conservative">
                                Conservative - Prefer stable, low-risk investments
                              </SelectItem>
                              <SelectItem value="moderate">Moderate - Balanced approach to risk and return</SelectItem>
                              <SelectItem value="aggressive">
                                Aggressive - Comfortable with high-risk, high-return investments
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Investment Recommendations Preview */}
                        <div className="p-6 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <SparklesIcon className="w-5 h-5 text-purple-600" />
                            Investment Recommendations Preview
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
                              <div className="text-2xl mb-2">📈</div>
                              <h4 className="font-medium">Mutual Funds</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">Diversified portfolio</p>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
                              <div className="text-2xl mb-2">🏦</div>
                              <h4 className="font-medium">Fixed Deposits</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">Stable returns</p>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
                              <div className="text-2xl mb-2">💎</div>
                              <h4 className="font-medium">Gold ETF</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">Hedge against inflation</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-between items-center mt-8"
          >
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 bg-transparent"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {currentStep < steps.length ? (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center gap-2"
                >
                  Next
                  <ArrowRightIcon className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Setting up your dashboard...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <SparklesIcon className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
