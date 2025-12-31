"use client";

import { useState, useEffect } from 'react';

export default function MatchPage() {
  const [users, setUsers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [interviewers, setInterviewers] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [selectedInterviewer, setSelectedInterviewer] = useState('');
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setCandidates(data.filter(u => u.role === 'candidate'));
        setInterviewers(data.filter(u => u.role === 'interviewer'));
      })
      .catch(err => {
        console.error(err);
        setMessage('Failed to load users. Is the backend running?');
      });
  }, []);

  const handleMatch = async () => {
    if (!selectedCandidate || !selectedInterviewer) {
      setMessage('⚠️ Please select both a candidate and an interviewer');
      return;
    }

    setLoading(true);
    setMessage('');
    setProposals([]);

    try {
      const res = await fetch('http://localhost:8000/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId: selectedCandidate, interviewerId: selectedInterviewer })
      });

      const data = await res.json();
      setProposals(data.proposals || []);
      setMessage(
        data.message || 
        (data.proposals?.length > 0 
          ? '🎉 Common slots found! Calendar invites sent!' 
          : '😔 No common slots found. Try different availability.')
      );
    } catch (err) {
      setMessage('❌ Error connecting to server. Check backend.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-pink-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Big Colorful Title */}
        <h1 
          className="big-gradient-title relative text-center mb-12"
          data-text="Match Interview Slots"
        >
          Match Interview Slots
        </h1>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 mb-12 border border-purple-200 dark:border-purple-800">

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Candidate Dropdown */}
            <div>
              <label className="block text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200 flex items-center gap-3">
                🎯 Select Candidate
              </label>
              <select
                value={selectedCandidate}
                onChange={(e) => setSelectedCandidate(e.target.value)}
                className="w-full px-8 py-6 text-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 border-4 border-indigo-300 dark:border-indigo-600 rounded-2xl focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50 transition-all duration-300 shadow-lg"
              >
                <option value="">Choose a candidate...</option>
                {candidates.map(c => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Interviewer Dropdown */}
            <div>
              <label className="block text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200 flex items-center gap-3">
                👔 Select Interviewer
              </label>
              <select
                value={selectedInterviewer}
                onChange={(e) => setSelectedInterviewer(e.target.value)}
                className="w-full px-8 py-6 text-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 border-4 border-purple-300 dark:border-purple-600 rounded-2xl focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-300 focus:ring-opacity-50 transition-all duration-300 shadow-lg"
              >
                <option value="">Choose an interviewer...</option>
                {interviewers.map(i => (
                  <option key={i._id} value={i._id}>
                    {i.name} ({i.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Match Button */}
          <div className="text-center">
            <button
              onClick={handleMatch}
              disabled={loading}
              className="group relative inline-flex items-center justify-center px-16 py-6 text-2xl font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 disabled:scale-100 disabled:opacity-60 transition-all duration-500 overflow-hidden"
            >
              <span className="relative z-10">
                {loading ? '🔍 Finding Magic Slots...' : '✨ Find Common Slots'}
              </span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-30 transition-opacity duration-500"></span>
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`text-center text-2xl font-bold py-8 px-12 rounded-3xl mb-12 shadow-xl ${
            proposals.length > 0 
              ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900 dark:to-emerald-900 dark:text-green-200' 
              : 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 dark:from-orange-900 dark:to-amber-900 dark:text-orange-200'
          }`}>
            {message}
          </div>
        )}

        {/* Proposed Slots */}
        {proposals.length > 0 && (
          <div>
            <h2 className="big-gradient-title text-center mb-12" data-text="Proposed Interview Slots">
              Proposed Interview Slots
            </h2>

            <div className="grid md:grid-cols-3 gap-10">
              {proposals.map((slot, i) => (
                <div 
                  key={i} 
                  className="group bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 border-4 border-purple-400 dark:border-purple-600 rounded-3xl p-8 text-center shadow-2xl transform hover:scale-110 hover:shadow-purple-500/50 transition-all duration-500"
                >
                  <div className="text-6xl mb-6">🗓️</div>
                  <p className="text-3xl font-black text-purple-800 dark:text-purple-300 mb-4">
                    Slot {i + 1}
                  </p>
                  <div className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    <p className="font-bold">
                      {new Date(slot.start).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mt-4">
                      {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      <span className="mx-4 text-3xl">→</span>
                      {new Date(slot.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400 animate-pulse">
                    📧 Calendar invite sent!
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}