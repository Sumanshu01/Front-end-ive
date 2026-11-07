import React, { useState } from 'react';
import {
  DetectiveUser,
  getRegisteredUsers,
  saveRegisteredUsers,
  setCurrentSessionUid,
} from '../types/auth';

interface AuthPageProps {
  currentUser: DetectiveUser | null;
  authPromptMessage?: string | null;
  onAuthSuccess: (user: DetectiveUser) => void;
  onLogout: () => void;
  onClose: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  currentUser,
  authPromptMessage,
  onAuthSuccess,
  onLogout,
  onClose,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('register');

  // Registration state
  const [name, setName] = useState('');
  const [regUid, setRegUid] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [semester, setSemester] = useState<number>(1);
  const [regPassword, setRegPassword] = useState('');

  // Login state
  const [loginUid, setLoginUid] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedName = name.trim();
    const normalizedUid = regUid.trim().toUpperCase();
    const trimmedMobile = mobile.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !normalizedUid || !trimmedMobile || !trimmedEmail || !regPassword) {
      setErrorMsg('Please fill in all required registration fields.');
      return;
    }

    if (trimmedMobile.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit Mobile Number.');
      return;
    }

    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setErrorMsg('Please enter a valid Email ID.');
      return;
    }

    if (semester < 1 || semester > 8) {
      setErrorMsg('Semester must be between 1 and 8.');
      return;
    }

    if (regPassword.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    const existingUsers = getRegisteredUsers();
    if (existingUsers.some((u) => u.uid.toUpperCase() === normalizedUid)) {
      setErrorMsg(`UID "${normalizedUid}" is already registered. Please switch to Login.`);
      return;
    }

    const newUser: DetectiveUser = {
      name: trimmedName,
      uid: normalizedUid,
      mobile: trimmedMobile,
      email: trimmedEmail,
      semester,
      password: regPassword,
      registeredAt: new Date().toISOString(),
    };

    const updated = [...existingUsers, newUser];
    saveRegisteredUsers(updated);
    setCurrentSessionUid(newUser.uid);
    setSuccessMsg(`Detective ${newUser.name} (${newUser.uid}) registered and signed in!`);
    onAuthSuccess(newUser);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const normalizedUid = loginUid.trim().toUpperCase();
    if (!normalizedUid || !loginPassword) {
      setErrorMsg('Please enter both your UID and Password.');
      return;
    }

    const existingUsers = getRegisteredUsers();
    const foundUser = existingUsers.find((u) => u.uid.toUpperCase() === normalizedUid);

    if (!foundUser) {
      setErrorMsg(`No account found with UID "${normalizedUid}". Please register first.`);
      return;
    }

    if (foundUser.password !== loginPassword) {
      setErrorMsg('Incorrect password for this UID. Please try again.');
      return;
    }

    setCurrentSessionUid(foundUser.uid);
    setSuccessMsg(`Welcome back, Detective ${foundUser.name}!`);
    onAuthSuccess(foundUser);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/45 backdrop-blur-sm flex items-start justify-center pt-20 pb-10 px-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#f8f7f4] border border-black/15 rounded-3xl shadow-2xl overflow-hidden text-stone-900">
        {/* Top Accent Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-sky-500 to-lime-500" />

        {/* Header with NexaSoul Logos */}
        <div className="p-5 sm:p-6 border-b border-black/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white">
          <div className="flex items-center gap-3.5">
            <img
              src="/assets/compass-logo.jpeg"
              alt="NexaSoul Compass"
              className="w-12 h-12 rounded-full object-cover border border-black/15 shadow-sm shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <img
                  src="/assets/nexasoul-logo.png"
                  alt="NexaSoul"
                  className="h-6 object-contain"
                />
                <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-semibold">
                  Mandatory Participant Auth
                </span>
              </div>
              <h2
                className="text-xl sm:text-2xl font-bold mt-1 tracking-tight text-stone-900 leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Frontendive® Registration &amp; Login
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="self-end sm:self-center px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-xs font-medium text-stone-700 transition-colors cursor-pointer"
          >
            ← Back
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-7">
          {/* Mandatory Login Gate Notice if triggered by trying to play */}
          {authPromptMessage && !currentUser && (
            <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm font-medium flex items-center gap-2.5 shadow-sm">
              <span className="text-base">🔒</span>
              <span>{authPromptMessage}</span>
            </div>
          )}

          {/* Currently Logged-in Profile Card */}
          {currentUser && (
            <div className="mb-6 p-4 rounded-2xl bg-white border border-emerald-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-emerald-700 font-bold">
                  Active Signed-In Detective
                </div>
                <div className="text-lg font-bold text-stone-900 mt-0.5">
                  {currentUser.name}{' '}
                  <span className="text-sm font-mono text-sky-700">({currentUser.uid})</span>
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  Semester {currentUser.semester} • {currentUser.email} • {currentUser.mobile}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Continue Game
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium text-xs hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-stone-200/70 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              New Registration
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Detective Login (UID)
            </button>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
              ✓ {successMsg}
            </div>
          )}

          {mode === 'register' ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-600 font-semibold mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-sky-600"
                  />
                </div>

                {/* UID */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-600 font-semibold mb-1.5">
                    UID (User ID) *
                  </label>
                  <input
                    type="text"
                    required
                    value={regUid}
                    onChange={(e) => setRegUid(e.target.value.toUpperCase())}
                    placeholder="e.g. 23BCS10492"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 font-mono text-sm focus:outline-none focus:border-sky-600"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-600 font-semibold mb-1.5">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-sky-600"
                  />
                </div>

                {/* Email ID */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-600 font-semibold mb-1.5">
                    Email ID *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. detective@cuchd.in"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-sky-600"
                  />
                </div>

                {/* Semester (1-8) */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-600 font-semibold mb-1.5">
                    Semester (1 - 8) *
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-sky-600"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem} className="bg-white text-stone-900">
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Create Password */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-600 font-semibold mb-1.5">
                    Create Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Create your login password"
                      className="w-full px-4 py-2.5 pr-16 rounded-xl bg-white border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-sky-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-sky-700 font-semibold hover:underline"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-2 rounded-xl bg-stone-900 text-white font-bold text-sm hover:bg-stone-800 transition-colors cursor-pointer shadow-md"
              >
                Register Detective Account &amp; Start Playing
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-600 font-semibold mb-1.5">
                  User ID (UID) *
                </label>
                <input
                  type="text"
                  required
                  value={loginUid}
                  onChange={(e) => setLoginUid(e.target.value.toUpperCase())}
                  placeholder="Enter your registered UID (e.g. 23BCS10492)"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 font-mono text-sm focus:outline-none focus:border-sky-600"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-600 font-semibold mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter the password you created"
                    className="w-full px-4 py-2.5 pr-16 rounded-xl bg-white border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-sky-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-sky-700 font-semibold hover:underline"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-2 rounded-xl bg-stone-900 text-white font-bold text-sm hover:bg-stone-800 transition-colors cursor-pointer shadow-md"
              >
                Sign In with UID &amp; Play Now
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
