'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setDropdownOpen(false);
    router.push('/');
  };

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <header className="border-b bg-white/70 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-sage-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
            <span className="text-lg">T</span>
          </div>
          <span className="font-display font-semibold text-xl text-ink-900 hidden sm:block">
            TCM Health
          </span>
        </div>

        <nav className="flex items-center gap-5 sm:gap-6">
          <a
            href="/"
            className="text-sm font-medium text-ink-700 hover:text-sage-600 transition-colors"
          >
            Home
          </a>
          <a
            href="/assessment/constitution"
            className="text-sm font-medium text-ink-700 hover:text-sage-600 transition-colors"
          >
            Assessment
          </a>
          <a
            href="/education"
            className="text-sm font-medium text-ink-700 hover:text-sage-600 transition-colors"
          >
            Education
          </a>

          {!loading && (
            <>
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-sage-600 transition-colors"
                  >
                    <div className="w-8 h-8 bg-sage-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {getUserInitials()}
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        dropdownOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.email}
                        </p>
                      </div>
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile & History
                      </a>
                      {user.email === 'babylon8@gmail.com' && (
                        <a
                          href="/admin"
                          className="block px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 transition-colors font-medium"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Admin Dashboard
                        </a>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <a
                  href="/auth/login"
                  className="text-sm font-medium px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors"
                >
                  Login
                </a>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
