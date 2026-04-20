import AppCalculator from "@/components/AppCalculator";

export default function Calculator() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4 bg-gray-50 dark:bg-gray-900/50 transition-colors duration-500">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent drop-shadow-sm">
          GRE Calculator
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Practice with the same interface you'll see on test day. Efficient
          math starts with efficient tools.
        </p>
      </div>

      <div className="relative z-10">
        <AppCalculator />
      </div>

      <div className="mt-12 text-center max-w-lg">
        <p className="text-sm font-medium text-gray-400 dark:text-gray-500 italic">
          "Do not divide by zero. The world depends on it."
        </p>
        <div className="mt-4 flex gap-4 justify-center text-xs text-gray-400">
          <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            Keyboard Shortcuts Enabled
          </span>
          <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            Full Screen Mode Available
          </span>
        </div>
      </div>
    </div>
  );
}
