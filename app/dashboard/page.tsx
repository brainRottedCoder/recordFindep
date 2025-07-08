"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  WalletIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartPieIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline"
import { Navbar } from "@/components/layout/navbar"

const monthlyData = [
  { month: "Jan", income: 5000, expenses: 3200, savings: 1800 },
  { month: "Feb", income: 5200, expenses: 3400, savings: 1800 },
  { month: "Mar", income: 4800, expenses: 3600, savings: 1200 },
  { month: "Apr", income: 5500, expenses: 3100, savings: 2400 },
  { month: "May", income: 5300, expenses: 3800, savings: 1500 },
  { month: "Jun", income: 5700, expenses: 3300, savings: 2400 },
]

const expenseCategories = [
  { name: "Food & Dining", value: 1200, color: "#FF6B6B" },
  { name: "Transportation", value: 800, color: "#4ECDC4" },
  { name: "Shopping", value: 600, color: "#45B7D1" },
  { name: "Entertainment", value: 400, color: "#96CEB4" },
  { name: "Bills & Utilities", value: 900, color: "#FFEAA7" },
]

const savingsGoalsDefault = [
  { name: "Emergency Fund", current: 8500, target: 15000, emoji: "🛡️" },
  { name: "Vacation to Japan", current: 3200, target: 8000, emoji: "🗾" },
  { name: "New Laptop", current: 18000, target: 25000, emoji: "💻" },
]

export default function DashboardPage() {
  const [totalBalance, setTotalBalance] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [user, setUser] = useState<{ name: string } | null>(null)
  const router = useRouter()
  const [financialData, setFinancialData] = useState<any>(null)

  useEffect(() => {
    // Check authentication
    const authStatus = localStorage.getItem("finverse_auth")
    const userData = localStorage.getItem("finverse_user")

    if (authStatus !== "true") {
      router.push("/auth")
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Load financial data
    const savedFinancialData = localStorage.getItem("finverse_financial_data")
    if (savedFinancialData) {
      setFinancialData(JSON.parse(savedFinancialData))
    }

    setIsLoaded(true)
    // Animate balance counting up
    const timer = setInterval(() => {
      setTotalBalance((prev) => {
        if (prev < 47500) {
          return prev + 500
        }
        clearInterval(timer)
        return 47500
      })
    }, 50)

    return () => clearInterval(timer)
  }, [router])

  const savingsGoals = financialData
    ? [
        {
          name: financialData.emergencyFund.name,
          current: Number.parseInt(financialData.emergencyFund.current) || 0,
          target: Number.parseInt(financialData.emergencyFund.target) || 15000,
          emoji: "🛡️",
        },
        {
          name: financialData.goal1.name || "Savings Goal 1",
          current: Number.parseInt(financialData.goal1.current) || 0,
          target: Number.parseInt(financialData.goal1.target) || 50000,
          emoji: "🎯",
        },
        {
          name: financialData.goal2.name || "Savings Goal 2",
          current: Number.parseInt(financialData.goal2.current) || 0,
          target: Number.parseInt(financialData.goal2.target) || 100000,
          emoji: "🚀",
        },
      ].filter((goal) => goal.name && goal.target > 0)
    : savingsGoalsDefault

  const monthlyIncome = financialData?.monthlyIncome
    ? `₹${Number.parseInt(financialData.monthlyIncome).toLocaleString()}`
    : "₹5,700"

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-900/20 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
          <span className="text-lg font-medium">Loading your dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-900/20">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Good morning, <span className="handwritten gradient-text">{user.name.split(" ")[0]}</span>! ☀️
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Here's what's happening with your money today</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Balance</p>
              <p className="text-3xl font-bold gradient-text">₹{totalBalance.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Monthly Income",
              value: monthlyIncome,
              change: "+8%",
              icon: ArrowTrendingUpIcon,
              color: "text-emerald-600",
            },
            {
              title: "Monthly Expenses",
              value: "₹3,300",
              change: "-12%",
              icon: ArrowTrendingDownIcon,
              color: "text-red-500",
            },
            { title: "Savings Rate", value: "42%", change: "+5%", icon: ChartPieIcon, color: "text-blue-600" },
            {
              title: "Investment Growth",
              value: "₹12,400",
              change: "+15%",
              icon: SparklesIcon,
              color: "text-purple-600",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="glass-card hover:shadow-lg transition-all duration-300 border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <Badge variant="secondary" className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{stat.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Income vs Expenses Chart */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-600" />
                  Income vs Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Area type="monotone" dataKey="income" stackId="1" stroke="#10B981" fill="url(#incomeGradient)" />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stackId="2"
                      stroke="#EF4444"
                      fill="url(#expenseGradient)"
                    />
                    <defs>
                      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Expense Categories */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <WalletIcon className="w-5 h-5 text-purple-600" />
                  Expense Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {expenseCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`₹${value}`, "Amount"]}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {expenseCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <span className="text-sm font-medium">₹{category.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Savings Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartPieIcon className="w-5 h-5 text-emerald-600" />
                Savings Goals
                <Badge variant="secondary" className="ml-auto">
                  3 Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {savingsGoals.map((goal, index) => {
                  const progress = (goal.current / goal.target) * 100
                  const remaining = goal.target - goal.current

                  return (
                    <motion.div
                      key={goal.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="p-4 rounded-xl bg-gradient-to-r from-white/50 to-emerald-50/50 dark:from-gray-800/50 dark:to-emerald-900/20"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{goal.emoji}</span>
                          <div>
                            <h3 className="font-semibold">{goal.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              ₹{remaining.toLocaleString()} remaining
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">₹{goal.current.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">of ₹{goal.target.toLocaleString()}</p>
                        </div>
                      </div>
                      <Progress value={progress} className="h-3" />
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm font-medium">{progress.toFixed(1)}% complete</span>
                        <Button size="sm" variant="outline" className="text-xs bg-transparent">
                          Add Money
                        </Button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Smart Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8"
        >
          <Card className="glass-card border-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-emerald-600" />
                Smart Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50">
                  <h4 className="font-semibold text-emerald-600 mb-2">🎉 Great Job!</h4>
                  <p className="text-sm">You saved 12% more this month compared to last month. Keep it up!</p>
                </div>
                <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50">
                  <h4 className="font-semibold text-orange-600 mb-2">☕ Coffee Alert</h4>
                  <p className="text-sm">You spent ₹450 on coffee this week. Try brewing at home to save ₹300/week!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
