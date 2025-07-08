"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  AcademicCapIcon,
  TrophyIcon,
  FireIcon,
  LightBulbIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  StarIcon,
} from "@heroicons/react/24/outline"
import { Navbar } from "@/components/layout/navbar"

interface Lesson {
  id: string
  title: string
  description: string
  duration: string
  difficulty: "beginner" | "intermediate" | "advanced"
  category: string
  completed: boolean
  locked: boolean
  content: string
  quiz?: {
    question: string
    options: string[]
    correct: number
  }
}

interface LearningPath {
  id: string
  name: string
  description: string
  icon: any
  color: string
  lessons: string[]
  progress: number
}

const lessons: Lesson[] = [
  {
    id: "1",
    title: "What is Money?",
    description: "Understanding the basics of money and its role in our lives",
    duration: "5 min",
    difficulty: "beginner",
    category: "Basics",
    completed: true,
    locked: false,
    content: `# What is Money? 💰

Money is a medium of exchange that makes trading easier. Instead of bartering (trading goods directly), we use money as a common way to measure value.

## Key Functions of Money:
1. **Medium of Exchange** - We use it to buy things
2. **Store of Value** - We can save it for later
3. **Unit of Account** - We measure prices with it

## Fun Fact! 🤔
The first coins were made around 600 BC in ancient Turkey. Before that, people used shells, stones, and even cattle as money!

## Modern Money
Today, most money is digital - just numbers in bank computers. Only about 8% of money exists as physical cash!`,
    quiz: {
      question: "What are the three main functions of money?",
      options: [
        "Buy, Save, Count",
        "Medium of Exchange, Store of Value, Unit of Account",
        "Spend, Invest, Donate",
        "Earn, Save, Spend",
      ],
      correct: 1,
    },
  },
  {
    id: "2",
    title: "Creating Your First Budget",
    description: "Learn the 50-30-20 rule and how to track your expenses",
    duration: "8 min",
    difficulty: "beginner",
    category: "Budgeting",
    completed: true,
    locked: false,
    content: `# Creating Your First Budget 📊

A budget is your money plan! It helps you decide how to spend your income wisely.

## The 50-30-20 Rule 🎯

This simple rule divides your after-tax income into three buckets:

### 🏠 50% - Needs (Must-haves)
- Rent/mortgage
- Groceries
- Utilities
- Transportation
- Insurance

### 🎉 30% - Wants (Nice-to-haves)
- Dining out
- Entertainment
- Shopping
- Hobbies
- Subscriptions

### 💰 20% - Savings & Debt
- Emergency fund
- Retirement savings
- Debt payments
- Investments

## Pro Tips! ✨
- Track expenses for a week before creating your budget
- Use apps or spreadsheets to monitor spending
- Review and adjust monthly
- Don't be too strict - allow some flexibility!`,
    quiz: {
      question: "In the 50-30-20 rule, what percentage should go to savings?",
      options: ["50%", "30%", "20%", "10%"],
      correct: 2,
    },
  },
  {
    id: "3",
    title: "Emergency Funds: Your Financial Safety Net",
    description: "Why you need an emergency fund and how to build one",
    duration: "6 min",
    difficulty: "beginner",
    category: "Savings",
    completed: false,
    locked: false,
    content: `# Emergency Funds: Your Financial Safety Net 🛡️

An emergency fund is money set aside for unexpected expenses. Think of it as your financial superhero cape!

## Why Do You Need One? 🤔

Life is unpredictable:
- Job loss
- Medical emergencies
- Car repairs
- Home maintenance
- Family emergencies

## How Much Should You Save? 💭

**Beginner Goal**: ₹1,000 (for small emergencies)
**Standard Goal**: 3-6 months of expenses
**Advanced Goal**: 6-12 months of expenses

## Where to Keep It? 🏦

- High-yield savings account
- Money market account
- Short-term fixed deposits

**Important**: Keep it separate from your regular savings and easily accessible!

## Building Your Fund 🏗️

1. Start small - even ₹50/week helps
2. Automate transfers
3. Use windfalls (bonuses, tax refunds)
4. Sell items you don't need
5. Take on a side gig

Remember: It's not about the amount, it's about starting!`,
    quiz: {
      question: "What's a good starter emergency fund goal?",
      options: ["₹100", "₹500", "₹1,000", "₹10,000"],
      correct: 2,
    },
  },
  {
    id: "4",
    title: "Understanding Credit Scores",
    description: "What credit scores are and why they matter",
    duration: "10 min",
    difficulty: "intermediate",
    category: "Credit",
    completed: false,
    locked: false,
    content: `# Understanding Credit Scores 📈

Your credit score is like a report card for how well you handle borrowed money. It's a number between 300-850 that lenders use to decide if they'll lend you money.

## What Affects Your Credit Score? 🎯

### Payment History (35%) 💳
- Pay bills on time
- Avoid late payments
- Don't skip payments

### Credit Utilization (30%) 📊
- Keep credit card balances low
- Use less than 30% of available credit
- Pay off balances monthly

### Length of Credit History (15%) ⏰
- Keep old accounts open
- Don't close your first credit card
- Build history over time

### Credit Mix (10%) 🔄
- Have different types of credit
- Credit cards, loans, mortgages
- Don't open accounts just for mix

### New Credit (10%) 🆕
- Don't apply for too many cards at once
- Space out credit applications
- Only apply when needed

## Credit Score Ranges 📏

- **300-579**: Poor
- **580-669**: Fair  
- **670-739**: Good
- **740-799**: Very Good
- **800-850**: Excellent

## Tips to Improve Your Score ⬆️

1. Pay all bills on time
2. Keep credit card balances low
3. Don't close old credit cards
4. Check your credit report regularly
5. Pay down debt strategically`,
    quiz: {
      question: "What's the most important factor in your credit score?",
      options: ["Credit utilization", "Payment history", "Length of history", "Credit mix"],
      correct: 1,
    },
  },
  {
    id: "5",
    title: "Investment Basics: Stocks vs Bonds",
    description: "Learn the difference between stocks and bonds",
    duration: "12 min",
    difficulty: "intermediate",
    category: "Investing",
    completed: false,
    locked: true,
    content: `# Investment Basics: Stocks vs Bonds 📈📉

Investing is putting your money to work to grow over time. Let's explore two main types of investments!

## Stocks 📊

When you buy stock, you own a tiny piece of a company!

### Pros:
- Higher potential returns
- Dividends (company profits shared)
- Ownership in companies you believe in
- Liquidity (easy to sell)

### Cons:
- Higher risk
- Price volatility
- No guaranteed returns
- Requires research

### Example:
If you buy Apple stock at ₹1,000 and it grows to ₹1,200, you made ₹200 profit (20% return)!

## Bonds 🏛️

Bonds are like IOUs - you lend money to companies or governments.

### Pros:
- More stable than stocks
- Regular interest payments
- Lower risk
- Predictable returns

### Cons:
- Lower potential returns
- Interest rate risk
- Inflation risk
- Less exciting than stocks

### Example:
You buy a ₹10,000 bond paying 5% annually. You'll get ₹500 per year for the bond's term.

## Diversification is Key! 🔑

Don't put all eggs in one basket:
- Mix stocks and bonds
- Different industries
- Different countries
- Different company sizes

## Getting Started 🚀

1. Start with index funds (diversified automatically)
2. Use SIP (Systematic Investment Plan)
3. Invest regularly, not all at once
4. Think long-term (5+ years)
5. Don't panic during market dips!`,
    quiz: {
      question: "What do you own when you buy a stock?",
      options: ["A loan to the company", "A piece of the company", "The company's debt", "The company's building"],
      correct: 1,
    },
  },
]

const learningPaths: LearningPath[] = [
  {
    id: "beginner",
    name: "The Foundation Builder",
    description: "Perfect for complete beginners who want to understand money basics",
    icon: AcademicCapIcon,
    color: "from-blue-400 to-blue-600",
    lessons: ["1", "2", "3"],
    progress: 67,
  },
  {
    id: "saver",
    name: "The Smart Saver",
    description: "Learn advanced saving strategies and emergency planning",
    icon: ShieldCheckIcon,
    color: "from-green-400 to-green-600",
    lessons: ["3", "2", "4"],
    progress: 33,
  },
  {
    id: "investor",
    name: "The Future Investor",
    description: "Dive into investments, stocks, and building wealth",
    icon: ChartBarIcon,
    color: "from-purple-400 to-purple-600",
    lessons: ["4", "5"],
    progress: 0,
  },
  {
    id: "risk-taker",
    name: "The Risk Taker",
    description: "Advanced strategies for experienced money managers",
    icon: FireIcon,
    color: "from-orange-400 to-red-600",
    lessons: ["5"],
    progress: 0,
  },
]

export default function LearnPage() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const completedLessons = lessons.filter((l) => l.completed).length
  const totalLessons = lessons.length
  const overallProgress = (completedLessons / totalLessons) * 100

  const handleStartLesson = (lesson: Lesson) => {
    if (lesson.locked) return
    setCurrentLesson(lesson)
  }

  const handleCompleteLesson = () => {
    if (currentLesson?.quiz) {
      setShowQuiz(true)
    } else {
      // Mark lesson as completed
      setCurrentLesson(null)
    }
  }

  const handleQuizSubmit = () => {
    if (selectedAnswer === currentLesson?.quiz?.correct) {
      setQuizCompleted(true)
      // Mark lesson as completed
      setTimeout(() => {
        setCurrentLesson(null)
        setShowQuiz(false)
        setQuizCompleted(false)
        setSelectedAnswer(null)
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
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
            <span className="gradient-text">Learn</span>
            <span className="handwritten text-blue-600"> Finance</span> 🎓
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Master money management through interactive lessons and personalized learning paths
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <TrophyIcon className="w-5 h-5 text-yellow-600" />
              <span className="font-medium">{completedLessons} lessons completed</span>
            </div>
            <div className="flex-1 max-w-xs">
              <Progress value={overallProgress} className="h-2" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">{overallProgress.toFixed(0)}% complete</span>
          </div>
        </motion.div>

        {!currentLesson ? (
          <>
            {/* Learning Paths */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6">Choose Your Learning Path</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {learningPaths.map((path, index) => (
                  <motion.div
                    key={path.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedPath(selectedPath === path.id ? null : path.id)}
                  >
                    <Card
                      className={`glass-card border-0 hover:shadow-xl transition-all duration-500 ${
                        selectedPath === path.id ? "ring-2 ring-blue-500" : ""
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${path.color} p-3 group-hover:scale-110 transition-transform duration-300`}
                          >
                            <path.icon className="w-full h-full text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">{path.name}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">{path.description}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm text-gray-600 dark:text-gray-300">{path.progress}%</span>
                          </div>
                          <Progress value={path.progress} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">{path.lessons.length} lessons</Badge>
                          <Button size="sm" variant={selectedPath === path.id ? "default" : "outline"}>
                            {selectedPath === path.id ? "Selected" : "Select Path"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* All Lessons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6">All Lessons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessons.map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <Card
                      className={`glass-card border-0 h-full hover:shadow-lg transition-all duration-300 ${
                        lesson.locked ? "opacity-60" : ""
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            {lesson.completed && (
                              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                <StarIcon className="w-4 h-4 text-white" />
                              </div>
                            )}
                            {lesson.locked && (
                              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                                <ShieldCheckIcon className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                          <Badge
                            variant="secondary"
                            className={
                              lesson.difficulty === "beginner"
                                ? "bg-green-100 text-green-800"
                                : lesson.difficulty === "intermediate"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {lesson.difficulty}
                          </Badge>
                        </div>

                        <h3 className="text-lg font-bold mb-2">{lesson.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{lesson.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                            <span>{lesson.duration}</span>
                            <span>•</span>
                            <span>{lesson.category}</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleStartLesson(lesson)}
                            disabled={lesson.locked}
                            className={lesson.completed ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                          >
                            {lesson.completed ? "Review" : lesson.locked ? "Locked" : "Start"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        ) : (
          /* Lesson Content */
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="glass-card border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{currentLesson.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <span>{currentLesson.duration}</span>
                      <Badge variant="secondary">{currentLesson.difficulty}</Badge>
                      <Badge variant="outline">{currentLesson.category}</Badge>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setCurrentLesson(null)}>
                    Back to Lessons
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {!showQuiz ? (
                  <>
                    <div className="prose prose-lg max-w-none dark:prose-invert mb-8">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: currentLesson.content
                            .replace(/\n/g, "<br>")
                            .replace(/#{1,6}\s/g, "<h3>")
                            .replace(/<h3>/g, '<h3 class="text-xl font-bold mt-6 mb-4">'),
                        }}
                      />
                    </div>
                    <div className="flex justify-center">
                      <Button
                        size="lg"
                        onClick={handleCompleteLesson}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8"
                      >
                        {currentLesson.quiz ? "Take Quiz" : "Complete Lesson"} ✨
                      </Button>
                    </div>
                  </>
                ) : (
                  /* Quiz */
                  <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                      <LightBulbIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Quick Quiz!</h3>
                      <p className="text-gray-600 dark:text-gray-300">Test your understanding of the lesson</p>
                    </div>

                    {!quizCompleted ? (
                      <>
                        <div className="mb-8">
                          <h4 className="text-lg font-semibold mb-4">{currentLesson.quiz?.question}</h4>
                          <div className="space-y-3">
                            {currentLesson.quiz?.options.map((option, index) => (
                              <button
                                key={index}
                                onClick={() => setSelectedAnswer(index)}
                                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                                  selectedAnswer === index
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                }`}
                              >
                                <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="text-center">
                          <Button
                            onClick={handleQuizSubmit}
                            disabled={selectedAnswer === null}
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8"
                          >
                            Submit Answer
                          </Button>
                        </div>
                      </>
                    ) : (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center"
                      >
                        <TrophyIcon className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-3xl font-bold text-emerald-600 mb-2">Congratulations! 🎉</h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                          You've completed the lesson successfully!
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
