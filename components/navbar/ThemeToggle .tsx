'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        className="opacity-0 pointer-events-none cursor-default"
        disabled
      >
        <Moon className="h-5 w-5" />
      </Button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={cn(
        'group relative cursor-pointer transition-colors hover:border-none',
        'bg-primary/5 text-primary hover:bg-primary/10',
        'dark:bg-primary/20 dark:text-primary/70 dark:hover:bg-primary/30'
      )}
    >
      <div
        className={cn(
          'relative z-10 transition-transform duration-500 ease-in-out',
          isDark ? 'rotate-180' : 'rotate-0'
        )}
      >
        {isDark ? (
          <Sun className="h-5 w-5 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
        ) : (
          <Moon className="h-5 w-5 text-primary" />
        )}
      </div>
    </Button>
  );
}
