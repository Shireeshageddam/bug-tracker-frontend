import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [canReset, setCanReset] = useState(false);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const type = hashParams.get('type');

    if (accessToken && refreshToken && type === 'recovery') {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      }).then(({ error }) => {
        if (error) {
          setMessage("❌ Failed to authenticate user. Please try again.");
        } else {
          setCanReset(true);
        }
      });
    } else {
      setMessage("⚠️ Invalid or expired reset link.");
    }
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("✅ Password updated! Redirecting to login...");
      setTimeout(() => navigate('/login'), 2500);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Your Password</h2>

        {message && (
          <p className={`text-center text-sm mb-4 ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        {canReset && (
          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              className="w-full border border-gray-300 p-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
