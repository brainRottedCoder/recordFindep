export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-emerald-900/10 dark:to-teal-900/10">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading FinVerse...
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Please wait while we set up your experience
          </p>
        </div>
      </div>
    </div>
  )
} 