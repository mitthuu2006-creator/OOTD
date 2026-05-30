import React, { useState } from 'react';
import { UserSession } from '../types';
import { User, LogIn, Mail, Lock, UserPlus, LogOut, Bookmark, Heart, MessageSquare, Feather } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthScreenProps {
  session: UserSession;
  onUpdateSession: (updated: Partial<UserSession>) => void;
  savedCount: number;
  likedCount: number;
}

export default function AuthScreen({ session, onUpdateSession, savedCount, likedCount }: AuthScreenProps) {
  const [isLoginView, setIsLoginView] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      onUpdateSession({
        isLoggedIn: true,
        email: email || 'curator@outfitoutclass.com',
        name: isLoginView ? (email.split('@')[0] || 'Modern Curator') : name || 'Aesthetic Writer'
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onUpdateSession({
        isLoggedIn: true,
        email: 'member@outfitoutclass.com',
        name: 'Sienna Ross'
      });
      setIsLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    onUpdateSession({
      isLoggedIn: false,
      email: null,
      name: null
    });
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  if (session.isLoggedIn) {
    return (
      <div id="auth-screen-profile" className="p-6 space-y-6">
        {/* User Badge Card */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="bg-[#0c0c0e] p-6 rounded-2xl border border-neutral-800/60 flex items-center space-x-4 shadow-sm"
        >
          <div className="w-14 h-14 rounded-full bg-[#dfd3c3] flex items-center justify-center font-serif text-lg font-bold text-neutral-900 shadow-inner">
            {session.name ? session.name.split(' ').map(n => n[0]).join('') : 'OD'}
          </div>
          <div>
            <span className="text-[10px] text-[#b8a291] font-mono tracking-widest uppercase">OOTD Journal Circle</span>
            <h3 className="text-xl font-bold font-serif tracking-tight text-white">{session.name}</h3>
            <p className="text-xs text-neutral-400 font-mono">{session.email}</p>
          </div>
        </motion.div>

        {/* Curated Curation Stats */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-[#121214] p-4 rounded-xl border border-neutral-800 flex flex-col justify-between">
            <div className="flex items-center space-x-2 text-[#b8a291]">
              <Bookmark className="w-4 h-4" />
              <span className="text-[10px] font-mono tracking-widest uppercase">Saved Looks</span>
            </div>
            <p className="text-2xl font-serif font-bold text-white mt-2">{savedCount}</p>
          </div>

          <div className="bg-[#121214] p-4 rounded-xl border border-neutral-800 flex flex-col justify-between">
            <div className="flex items-center space-x-2 text-rose-400">
              <Heart className="w-4 h-4" />
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">Likes Sent</span>
            </div>
            <p className="text-2xl font-serif font-bold text-white mt-2">{likedCount}</p>
          </div>
        </motion.div>

        {/* Content privileges explanation */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          transition={{ delay: 0.2 }}
          className="bg-[#121214] p-5 rounded-2xl border border-neutral-800 space-y-4 shadow-sm"
        >
          <span className="text-[10px] text-[#b8a291] font-mono tracking-widest uppercase flex items-center space-x-2">
            <Feather className="w-3.5 h-3.5" />
            <span>MEMBER PRIVILEGES</span>
          </span>

          <div className="space-y-3 font-sans text-xs text-neutral-300 leading-relaxed">
            <div className="flex start space-x-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#dfd3c3] mt-1.5 shrink-0" />
              <p>Write under verified OOTD aliases, and save fashion edits to your digital catalog.</p>
            </div>
            <div className="flex start space-x-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#dfd3c3] mt-1.5 shrink-0" />
              <p>Direct live comments under featured styling blogs with your member badge highlighted.</p>
            </div>
            <div className="flex start space-x-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#dfd3c3] mt-1.5 shrink-0" />
              <p>Use our advanced AI styling rooms with real-time prompt drafting.</p>
            </div>
          </div>
        </motion.div>

        {/* Logout Bottom Action */}
        <button
          onClick={handleLogout}
          className="w-full py-3.5 border border-neutral-800 rounded-xl font-serif text-sm text-neutral-400 hover:bg-neutral-900 hover:text-white transition-all flex items-center justify-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Curators Circle</span>
        </button>
      </div>
    );
  }

  return (
    <div id="auth-screen-sign-in" className="p-6 space-y-6">
      <div className="text-center space-y-2 mt-4">
        <span className="text-[10px] font-mono tracking-widest text-[#b8a291] uppercase">curators club</span>
        <h2 className="text-3xl font-bold font-serif tracking-tight text-white leading-none">
          {isLoginView ? 'The Guest Circle' : 'Join OOTD Journal'}
        </h2>
        <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto">
          {isLoginView
            ? 'Sign in to bookmark OOTD layouts, reply to editorials, and draft outfits within our smart styling studio.'
            : 'Register your reader badge to post outfit feedback, like editorial trends, and bookmark inspirations.'}
        </p>
      </div>

      {/* Main Authentication Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        className="bg-[#0b0b0d] border border-neutral-800/80 rounded-2xl p-5"
      >
        <form onSubmit={handleAuth} className="space-y-4">
          {!isLoginView && (
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sienna Ross"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#121214] border border-neutral-800 text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-neutral-700 rounded-lg"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                required
                placeholder="sienna@outfitoutclass.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#121214] border border-neutral-800 text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-neutral-700 rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">Secure Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#121214] border border-neutral-800 text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-neutral-700 rounded-lg"
              />
            </div>
          </div>

          {/* Action Log button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#dfd3c3] text-neutral-900 font-serif font-semibold rounded-lg text-sm mt-2 flex items-center justify-center space-x-2 transition-all hover:bg-[#d4c5b9] cursor-pointer"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
            ) : isLoginView ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Enter Journal</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Join Journal Circle</span>
              </>
            )}
          </button>
        </form>

        {/* View togglers */}
        <div className="text-center mt-4">
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="text-xs text-neutral-400 hover:text-white transition-all font-medium font-serif underline underline-offset-4"
          >
            {isLoginView ? 'Need a reader profile? Sign Up' : 'Already have a profile? Sign In'}
          </button>
        </div>
      </motion.div>

      {/* Styled Google Auth Alternative */}
      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-neutral-900" />
        <span className="flex-shrink mx-4 text-[10px] text-neutral-500 font-mono tracking-widest">OOTD PORTAL SYNC</span>
        <div className="flex-grow border-t border-neutral-900" />
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full py-3 bg-[#0a0a0c] border border-neutral-800 hover:bg-neutral-900 text-white transition-all font-serif text-xs flex items-center justify-center space-x-2.5 shadow-sm rounded-lg"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span>Instant Access with Google</span>
      </motion.button>
    </div>
  );
}
