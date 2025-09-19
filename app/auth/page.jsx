'use client'

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";


export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Sign up successful! Check your email to confirm.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        alert('Login successful!');
        window.location.href = '/';
      }
    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-page-wrapper">
      {/* Background Video */}
      <video
        className="video-background"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Project Title */}
      <h1 className="auth-title">Quiet Hours Scheduler</h1>

      {/* Auth Form */}
      <div className="auth-container">
        <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="********"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <button
          className="toggle-auth"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp
            ? 'Already have an account? Login'
            : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}
