// src/pages/Login.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@') || password.length < 8) {
      setError('Enter a valid email and password of at least 8 characters.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
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
          <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
          <p className="text-zinc-400 mb-6 text-sm">Enter your email and password to sign in!</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-zinc-300 text-sm mb-1">Email*</label>
              <input
                type="email"
                placeholder="mail@simmnple.com"
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
              <div className="flex items-center justify-between mt-1">
                <label className="flex items-center text-xs text-zinc-400">
                  <input type="checkbox" className="mr-1" onChange={() => setShowPassword(!showPassword)} /> Show Password
                </label>
                <a href="#" className="text-xs text-violet-400 hover:underline">Forgot Password?</a>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-violet-600 text-white p-3 rounded-lg font-semibold hover:bg-violet-700 transition"
            >
              Sign In
            </button>
          </form>
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-zinc-700" />
            <span className="mx-2 text-zinc-500 text-xs">or</span>
            <div className="flex-grow h-px bg-zinc-700" />
          </div>
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 bg-zinc-800 border border-zinc-700 text-white p-3 rounded-lg hover:bg-zinc-700 transition"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
          <p className="text-center text-xs text-zinc-500 mt-6">
            Not registered yet? <a href="/register" className="text-violet-400 hover:underline">Create an account</a>
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

export default Login;
