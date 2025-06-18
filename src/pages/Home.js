import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthProvider';
import { motion } from 'framer-motion';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* Header */}
      <header className="w-full px-4 sm:px-6 py-4 bg-white shadow flex flex-col sm:flex-row justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-700 ">
          🐞 Bug Tracker
        </Link>
        <nav className="space-x-4 mt-2 sm:mt-0">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
              >
                Create Account
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm text-gray-600">
                Logged in as <span className="font-semibold">{user.email}</span>
              </span>
              <button
                onClick={handleLogout}
                className="text-blue-600 hover:underline text-sm ml-2"
              >
                Not you? Logout
              </button>
            </>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <motion.main
        className="flex-1 flex flex-col items-center justify-center text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Optional Illustration */}
        <img
          src="/illustrations/bug-fixing.svg"
          alt="Bug Tracker Illustration"
          className="w-64 md:w-96 max-w-full h-auto mb-6 "
          
        />

        <motion.h2
          className="text-5xl font-extrabold text-gray-800 mb-4 leading-tight"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Track Bugs Like a Pro 🛠️
        </motion.h2>
        <p className="text-lg text-gray-600 max-w-xl mb-8">
          Create projects, assign tickets, and collaborate with your team in one powerful
          bug tracking dashboard.
        </p>

        {user ? (
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </Link>
        ) : (
          <Link
            to="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        )}

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-16 text-left w-full max-w-6xl px-4">
          <div>
            <h4 className="text-blue-600 font-bold">🗂️ Project Management</h4>
            <p className="text-sm text-gray-500">Organize issues by project and team.</p>
          </div>
          <div>
            <h4 className="text-blue-600 font-bold">🐞 Ticketing System</h4>
            <p className="text-sm text-gray-500">Log and manage bugs across workflows.</p>
          </div>
          <div>
            <h4 className="text-blue-600 font-bold">👥 Team Collaboration</h4>
            <p className="text-sm text-gray-500">Assign tickets and stay in sync.</p>
          </div>
          <div>
            <h4 className="text-blue-600 font-bold">📊 Dashboard Insights</h4>
            <p className="text-sm text-gray-500">Track project progress at a glance.</p>
          </div>
        </div>
      </motion.main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-4 mt-12">
        © {new Date().getFullYear()} Bug Tracker — All rights reserved.
      </footer>
    </div>
  );
}
