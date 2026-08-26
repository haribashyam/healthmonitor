import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme?: 'dark' | 'light';
  onToggle?: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme: controlledTheme,
  onToggle,
  className = ''
}) => {
  const [internalTheme, setInternalTheme] = useState<'dark' | 'light'>('dark');

  const isControlled = controlledTheme !== undefined;
  const currentTheme = isControlled ? controlledTheme : internalTheme;
  const isDark = currentTheme === 'dark';

  useEffect(() => {
    if (!isControlled) {
      const savedTheme = localStorage.getItem('vitalos_theme');
      if (savedTheme === 'light') {
        setInternalTheme('light');
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        setInternalTheme('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }
  }, [isControlled]);

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
      return;
    }

    const nextTheme = isDark ? 'light' : 'dark';
    setInternalTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('vitalos_theme', nextTheme);
  };

  return (
    <button
      id="theme-toggle-btn"
      onClick={handleToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode (current: ${currentTheme})`}
      className={`p-2 rounded-lg bg-slate-900/90 dark:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all shadow-sm ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 animate-fadeIn" />
      ) : (
        <Moon className="w-4 h-4 text-cyan-400 animate-fadeIn" />
      )}
    </button>
  );
};

