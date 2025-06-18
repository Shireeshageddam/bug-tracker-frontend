import React, { useState, useEffect } from 'react';
import { Moon, Sun, User, LogOut } from 'lucide-react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

export default function Topbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data?.user?.email || '');
    };
    getUser();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow px-6 py-4 flex justify-between items-center">
      <h2 className="text-xl font-bold text-blue-600 dark:text-white"></h2>

      <div className="flex items-center gap-4 relative">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-gray-600 dark:text-white hover:text-blue-600"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <User size={20} />
            <span className="hidden sm:inline text-sm text-gray-700 dark:text-white">
              {userEmail}
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md rounded">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
              >
                <LogOut size={16} className="inline-block mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
