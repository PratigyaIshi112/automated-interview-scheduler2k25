export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-pink-950 flex items-center justify-center px-6 py-12">
      <div className="max-w-5xl mx-auto text-center">
        {/* Big Colorful Gradient Title */}
        <h1 
          className="big-gradient-title relative mb-10"
          data-text="Automated Interview Scheduler with AI Matching"
        >
          Automated Interview Scheduler with AI Matching
        </h1>

        {/* Subtitle */}
        <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Submit your availability in plain English → AI intelligently parses it → Get perfectly matched interview slots with <span className="font-bold text-purple-600 dark:text-purple-400">calendar invites sent automatically</span>.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
          <a
            href="/availability"
            className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">📅 Submit Availability</span>
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          </a>

          <a
            href="/match"
            className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">✨ Match Slots</span>
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          </a>
        </div>

        {/* Optional subtle tagline */}
        <p className="mt-16 text-lg text-gray-500 dark:text-gray-400">
          Powered by AI • No more email ping-pong • Instant calendar sync
        </p>
      </div>
    </main>
  );
}