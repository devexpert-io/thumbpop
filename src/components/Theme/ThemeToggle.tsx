import React, { useEffect, useRef, useState } from 'react';
import { Laptop, Moon, Sun } from 'lucide-react';
import { ThemePreference, useTheme } from '../../core/theme/ThemeProvider';

const options: Array<{ value: ThemePreference; label: string; icon: React.ReactNode }> = [
  { value: 'system', label: 'System', icon: <Laptop size={16} /> },
  { value: 'light', label: 'Light', icon: <Sun size={16} /> },
  { value: 'dark', label: 'Dark', icon: <Moon size={16} /> },
];

const ThemeToggle: React.FC = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeIcon = React.useMemo(() => {
    if (theme === 'system') {
      return <Laptop size={16} />;
    }
    return resolvedTheme === 'dark' ? <Moon size={16} /> : <Sun size={16} />;
  }, [theme, resolvedTheme]);

  const activeLabel = React.useMemo(() => {
    const current = options.find((option) => option.value === theme);
    return current ? current.label : 'Theme';
  }, [theme]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-gray-200 bg-white/60 text-gray-700 shadow-sm transition-colors hover:bg-white dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:bg-slate-700"
        title="Theme"
      >
        {activeIcon}
        <span className="hidden sm:inline">{activeLabel}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-md border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 focus:outline-none dark:border-slate-700 dark:bg-slate-800">
          <div className="py-1">
            {options.map(({ value, label, icon }) => {
              const isActive = theme === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setTheme(value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? 'bg-purple-50 text-purple-700 dark:bg-purple-500/20 dark:text-purple-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
