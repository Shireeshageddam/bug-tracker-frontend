import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: loginError } = await supabase.auth.signInWithPassword(formData);

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-6 text-black-700">Login</h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="flex justify-between items-center mt-5 text-sm text-gray-600">
          <Link to="/forgot-password" className="text-indigo-600 hover:underline">
            Forgot Password?
          </Link>
          <Link to="/register" className="text-indigo-600 hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
