"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  KeyIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline"
import { Navbar } from "@/components/layout/navbar"

interface UserSettings {
  // Personal Information
  name: string
  email: string
  phone: string
  dateOfBirth: string
  occupation: string

  // Preferences
  currency: string
  language: string
  timezone: string
  theme: string

  // Notifications
  emailNotifications: boolean
  pushNotifications: boolean
  weeklyReports: boolean
  goalReminders: boolean

  // Privacy & Security
  twoFactorAuth: boolean
  dataSharing: boolean
  marketingEmails: boolean

  // Financial Settings
  budgetAlerts: boolean
  expenseCategories: string[]
  defaultPaymentMethod: string
}

const currencies = [
  { value: "INR", label: "₹ Indian Rupee (INR)" },
  { value: "USD", label: "$ US Dollar (USD)" },
  { value: "EUR", label: "€ Euro (EUR)" },
  { value: "GBP", label: "£ British Pound (GBP)" },
]

const languages = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिंदी (Hindi)" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
]

const timezones = [
  { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
]

export default function SettingsPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const [settings, setSettings] = useState<UserSettings>({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    occupation: "",
    currency: "INR",
    language: "en",
    timezone: "Asia/Kolkata",
    theme: "system",
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    goalReminders: true,
    twoFactorAuth: false,
    dataSharing: false,
    marketingEmails: false,
    budgetAlerts: true,
    expenseCategories: ["Food", "Transportation", "Entertainment", "Shopping"],
    defaultPaymentMethod: "card",
  })

  useEffect(() => {
    setMounted(true)

    // Check authentication
    const authStatus = localStorage.getItem("finverse_auth")
    const userData = localStorage.getItem("finverse_user")

    if (authStatus !== "true") {
      router.push("/auth")
      return
    }

    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Load saved settings or set defaults
      const savedSettings = localStorage.getItem("finverse_user_settings")
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...settings, ...parsed, theme: theme || "system" })
      } else {
        setSettings((prev) => ({
          ...prev,
          name: parsedUser.name,
          email: parsedUser.email,
          theme: theme || "system",
        }))
      }
    }
  }, [router, theme])

  const handleInputChange = (field: keyof UserSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      localStorage.setItem("finverse_user_settings", JSON.stringify(settings))

      // Update user data if name or email changed
      if (user) {
        const updatedUser = { ...user, name: settings.name, email: settings.email }
        localStorage.setItem("finverse_user", JSON.stringify(updatedUser))
        setUser(updatedUser)
      }

      setIsLoading(false)
      setSaveSuccess(true)

      setTimeout(() => setSaveSuccess(false), 3000)
    }, 1500)
  }

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      localStorage.clear()
      router.push("/")
    }
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    handleInputChange("theme", newTheme)
  }

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-gray-900 dark:to-purple-900/20 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <span className="text-lg font-medium">Loading settings...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-gray-900 dark:to-purple-900/20">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="gradient-text">Account</span>
            <span className="handwritten text-purple-600"> Settings</span> ⚙️
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your account preferences and privacy settings</p>
        </motion.div>

        {/* Success Message */}
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700">
              <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-700 dark:text-emerald-300 font-medium">Settings saved successfully!</span>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCircleIcon className="w-5 h-5 text-purple-600" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={settings.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={settings.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={settings.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      placeholder="Software Engineer"
                      value={settings.occupation}
                      onChange={(e) => handleInputChange("occupation", e.target.value)}
                      className="h-12"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Preferences */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GlobeAltIcon className="w-5 h-5 text-blue-600" />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select value={settings.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.value} value={currency.value}>
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select value={settings.language} onValueChange={(value) => handleInputChange("language", value)}>
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((language) => (
                            <SelectItem key={language.value} value={language.value}>
                              {language.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select value={settings.timezone} onValueChange={(value) => handleInputChange("timezone", value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((timezone) => (
                          <SelectItem key={timezone.value} value={timezone.value}>
                            {timezone.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Theme Selection */}
                  <div className="space-y-4">
                    <Label>Theme Preference</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: "light", label: "Light", icon: SunIcon },
                        { value: "dark", label: "Dark", icon: MoonIcon },
                        { value: "system", label: "System", icon: ComputerDesktopIcon },
                      ].map((themeOption) => (
                        <button
                          key={themeOption.value}
                          onClick={() => handleThemeChange(themeOption.value)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            theme === themeOption.value
                              ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                          }`}
                        >
                          <themeOption.icon className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                          <p className="text-sm font-medium">{themeOption.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BellIcon className="w-5 h-5 text-orange-600" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    {
                      key: "emailNotifications",
                      label: "Email Notifications",
                      description: "Receive updates via email",
                    },
                    {
                      key: "pushNotifications",
                      label: "Push Notifications",
                      description: "Get notified on your device",
                    },
                    {
                      key: "weeklyReports",
                      label: "Weekly Reports",
                      description: "Summary of your financial activity",
                    },
                    {
                      key: "goalReminders",
                      label: "Goal Reminders",
                      description: "Reminders about your savings goals",
                    },
                    {
                      key: "budgetAlerts",
                      label: "Budget Alerts",
                      description: "Alerts when you exceed budget limits",
                    },
                  ].map((notification) => (
                    <div key={notification.key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{notification.label}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{notification.description}</p>
                      </div>
                      <Switch
                        checked={settings[notification.key as keyof UserSettings] as boolean}
                        onCheckedChange={(checked) =>
                          handleInputChange(notification.key as keyof UserSettings, checked)
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Privacy & Security */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheckIcon className="w-5 h-5 text-emerald-600" />
                    Privacy & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Add an extra layer of security</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={settings.twoFactorAuth}
                        onCheckedChange={(checked) => handleInputChange("twoFactorAuth", checked)}
                      />
                      {settings.twoFactorAuth && (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
                        >
                          Enabled
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Data Sharing</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Share anonymized data for insights</p>
                    </div>
                    <Switch
                      checked={settings.dataSharing}
                      onCheckedChange={(checked) => handleInputChange("dataSharing", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Receive promotional content</p>
                    </div>
                    <Switch
                      checked={settings.marketingEmails}
                      onCheckedChange={(checked) => handleInputChange("marketingEmails", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <KeyIcon className="w-4 h-4" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <DevicePhoneMobileIcon className="w-4 h-4" />
                      Manage Connected Devices
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCardIcon className="w-5 h-5 text-emerald-600" />
                    Account Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Plan</span>
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">Pro</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Member since</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Jan 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data usage</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">2.4 GB</span>
                  </div>

                  <Separator />

                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
                    Upgrade Plan
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <UserCircleIcon className="w-4 h-4" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <ShieldCheckIcon className="w-4 h-4" />
                    Privacy Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <BellIcon className="w-4 h-4" />
                    Notification History
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="glass-card border-0 border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <ExclamationTriangleIcon className="w-5 h-5" />
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="destructive" onClick={handleDeleteAccount} className="w-full gap-2">
                    <TrashIcon className="w-4 h-4" />
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex justify-end"
        >
          <Button
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
