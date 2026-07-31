import React, { useState } from 'react';

interface AuthPageProps {
  onLogin: (userData: any) => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'candidate' | 'company' | 'admin'>('candidate');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = {
      id: Date.now(),
      name: name || email.split('@')[0] || 'User',
      email,
      role,
    };
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="glass max-w-md w-full rounded-3xl p-8 border border-surface-container shadow-2xl flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <img src="/logo.png" alt="GenuAI" className="w-12 h-12 object-contain" />
          <h1 className="text-2xl font-black text-on-surface">GenuAI Technologies</h1>
          <p className="text-sm text-on-surface-variant">Sign in or create your account</p>
        </div>

        <div className="flex bg-surface-bright p-1 rounded-xl border border-surface-container">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${
              isLogin ? 'bg-indigo-brand text-white shadow-sm' : 'text-on-surface-variant'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${
              !isLogin ? 'bg-indigo-brand text-white shadow-sm' : 'text-on-surface-variant'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="text-xs font-bold text-on-surface-variant block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2.5 rounded-xl border border-surface-container bg-surface-bright text-sm text-on-surface focus:outline-none focus:border-indigo-brand"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-on-surface-variant block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="candidate@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-surface-container bg-surface-bright text-sm text-on-surface focus:outline-none focus:border-indigo-brand"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface-variant block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-surface-container bg-surface-bright text-sm text-on-surface focus:outline-none focus:border-indigo-brand"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface-variant block mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl border border-surface-container bg-surface-bright text-sm text-on-surface focus:outline-none focus:border-indigo-brand"
            >
              <option value="candidate">Candidate</option>
              <option value="company">Company / HR</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-brand text-white font-bold text-sm hover:opacity-90 transition-opacity mt-2"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
