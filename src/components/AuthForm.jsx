import { useState } from 'react';

export default function AuthForm({ onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Placeholder auth flow. In a real app, call backend API for JWT auth.
      await new Promise((res) => setTimeout(res, 600));
      if (!email || !password) throw new Error('Please fill all fields');
      onAuthenticated({ email, role });
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
          <p className="text-slate-300 text-sm mt-1">Manage customers, items, and billing in one place</p>
        </div>

        <div className="flex mb-6 bg-white/10 rounded-lg p-1">
          <button
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${mode === 'login' ? 'bg-white text-slate-900' : 'text-white/80 hover:text-white'}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${mode === 'signup' ? 'bg-white text-slate-900' : 'text-white/80 hover:text-white'}`}
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-slate-200">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-slate-200">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-slate-200">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>User</option>
              <option>Admin</option>
            </select>
          </div>

          {error && <div className="text-rose-400 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition font-medium disabled:opacity-60"
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create account'}
          </button>

          <p className="text-xs text-slate-400 text-center">
            By continuing you agree to our Terms and Privacy.
          </p>
        </form>
      </div>
    </div>
  );
}
