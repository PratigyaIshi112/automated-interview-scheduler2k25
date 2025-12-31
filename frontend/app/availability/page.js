"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";

export default function Availability() {
  const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm();
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    try {
      const res = await fetch('http://localhost:8000/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();

      if (json.success) {
        setSuccess(true);
        reset(); // Clear form
        setTimeout(() => setSuccess(false), 5000); // Hide message after 5s
      } else {
        alert('Error: ' + (json.error || 'Something went wrong'));
      }
    } catch (err) {
      alert('Network error. Is the backend running?');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-pink-950 py-12 px-4 flex items-center justify-center">
      <div className="max-w-3xl w-full">

        {/* Big Gradient Title */}
        <h1 
          className="big-gradient-title relative text-center mb-12"
          data-text="Submit Your Availability"
        >
          Submit Your Availability
        </h1>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 border border-purple-200 dark:border-purple-800">

          {success && (
            <div className="mb-10 text-center p-6 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-2xl border-2 border-green-300 dark:border-green-700">
              <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                🎉 Availability saved & parsed by AI successfully!
              </p>
              <p className="mt-3 text-lg text-green-700 dark:text-green-300">
                You can now go to <strong>Match Slots</strong> and find common times.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

            {/* Name */}
            <div>
              <label className="block text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-3">
                👤 Full Name
              </label>
              <input
                {...register("name", { required: true })}
                placeholder="e.g., Gautam Kumar"
                className="w-full px-8 py-6 text-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 border-4 border-indigo-300 dark:border-indigo-600 rounded-2xl focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50 transition-all duration-300 shadow-md"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-3">
                ✉️ Email
              </label>
              <input
                {...register("email", { required: true })}
                type="email"
                placeholder="you@example.com"
                className="w-full px-8 py-6 text-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 border-4 border-purple-300 dark:border-purple-600 rounded-2xl focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-300 focus:ring-opacity-50 transition-all duration-300 shadow-md"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-3">
                🎭 Your Role
              </label>
              <select
                {...register("role", { required: true })}
                className="w-full px-8 py-6 text-xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 border-4 border-cyan-300 dark:border-cyan-600 rounded-2xl focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 transition-all duration-300 shadow-md"
                required
              >
                <option value="">Select your role...</option>
                <option value="candidate">🧑‍💼 Candidate</option>
                <option value="interviewer">👔 Interviewer</option>
              </select>
            </div>

            {/* Availability Text */}
            <div>
              <label className="block text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-3">
                📅 Describe Your Availability
              </label>
              <textarea
                {...register("rawAvailability")}
                rows="8"
                placeholder="e.g., I'm available January 2, 2026 from 10am to 5pm and January 3 from 9am to 1pm. Also free weekdays after 2pm..."
                className="w-full px-8 py-6 text-xl bg-white dark:bg-gray-700 border-4 border-pink-300 dark:border-pink-600 rounded-2xl focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50 transition-all duration-300 shadow-md resize-none"
              />
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 text-center">
                Write naturally — our AI will understand and convert it into time slots!
              </p>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative inline-flex items-center justify-center px-16 py-7 text-3xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 disabled:scale-100 disabled:opacity-60 transition-all duration-500 overflow-hidden"
              >
                <span className="relative z-10">
                  {isSubmitting ? '🔄 Saving...' : '🚀 Submit Availability'}
                </span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-30 transition-opacity duration-500"></span>
              </button>
            </div>
          </form>
        </div>

        {/* Tip */}
        <p className="text-center mt-12 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          💡 Tip: Use clear dates like <strong>January 2, 2026 10am to 5pm</strong> for best AI results!
        </p>
      </div>
    </div>
  );
}

//availablity