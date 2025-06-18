import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@') || password.length < 8) {
      setError('Enter a valid email and password of at least 8 characters.');
      return;
    }

    try {
      await signup(email, password, displayName);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex w-full max-w-5xl mx-auto">
        {/* Left: Form */}
        <div className="flex-1 flex flex-col justify-center px-8 py-12 bg-zinc-900 rounded-2xl shadow-2xl max-w-md">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-zinc-400 mb-6 text-sm">Enter your details to create an account!</p>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-zinc-300 text-sm mb-1">Display Name*</label>
              <input
                type="text"
                placeholder="John Doe"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>
            <div>
              <label className="block text-zinc-300 text-sm mb-1">Email*</label>
              <input
                type="email"
                placeholder="mail@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>
            <div>
              <label className="block text-zinc-300 text-sm mb-1">Password*</label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
              <div className="flex items-center mt-1">
                <label className="flex items-center text-xs text-zinc-400">
                  <input type="checkbox" className="mr-1" onChange={() => setShowPassword(!showPassword)} /> Show Password
                </label>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-violet-600 text-white p-3 rounded-lg font-semibold hover:bg-violet-700 transition"
            >
              Create Account
            </button>
          </form>
          <p className="text-center text-xs text-zinc-500 mt-6">
            Already have an account? <a href="/login" className="text-violet-400 hover:underline">Sign in</a>
          </p>
        </div>
        {/* Right: Globe/3D effect */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <img src="/Login%20Earth.png" alt="Globe" className="w-[350px] h-[350px] object-contain opacity-80" />
        </div>
      </div>
    </div>
  );
};

export default Register; 