import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordValidity, setPasswordValidity] = useState({});
  const navigate = useNavigate();

  const validatePassword = (password) => {
    return {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password),
    };
  };

  const isPasswordValid = (validity) =>
    validity.length &&
    validity.lowercase &&
    validity.uppercase &&
    validity.number &&
    validity.symbol;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    const { email, password, confirmPassword } = formData;

    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const validity = validatePassword(password);
    if (!isPasswordValid(validity)) {
      setError("Password does not meet all requirements");
      return;
    }

    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const user = data.user;
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([{ id: user.id, email: user.email }]);

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-black-700 mb-6">Create Your Account</h2>
        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.password}
            onChange={(e) => {
              const pwd = e.target.value;
              setFormData({ ...formData, password: pwd });
              setPasswordValidity(validatePassword(pwd));
            }}
          />

          {/* Password strength feedback */}
          <div className="text-sm text-gray-700 bg-gray-50 rounded p-3 border">
            <p className={`${passwordValidity.length ? 'text-green-600' : 'text-gray-500'}`}>• At least 8 characters</p>
            <p className={`${passwordValidity.uppercase ? 'text-green-600' : 'text-gray-500'}`}>• One uppercase letter</p>
            <p className={`${passwordValidity.lowercase ? 'text-green-600' : 'text-gray-500'}`}>• One lowercase letter</p>
            <p className={`${passwordValidity.number ? 'text-green-600' : 'text-gray-500'}`}>• One number</p>
            <p className={`${passwordValidity.symbol ? 'text-green-600' : 'text-gray-500'}`}>• One special character</p>
          </div>

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow transition duration-200"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
