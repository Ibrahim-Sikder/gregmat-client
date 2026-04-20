'use client';
import React, { useEffect, useState, useRef } from 'react';

interface TimerProps {
  initialSeconds: number;
  onTimeUp?: () => void;
}

export default function Timer({ initialSeconds, onTimeUp }: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    if (!isRunning) return;
    if (secondsLeft <= 0) {
      onTimeUp?.();
      setIsRunning(false);
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current as any);
    };
  }, [secondsLeft, isRunning, onTimeUp]);

  const toggle = () => setIsRunning((prev) => !prev);
  const reset = () => setSecondsLeft(initialSeconds);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex items-center gap-2 font-mono text-sm">
      <span>⏱ {formatTime(secondsLeft)}</span>
      <button
        onClick={toggle}
        className="px-2 py-1 rounded bg-blue-100 text-blue-800 hover:bg-blue-200"
      >
        {isRunning ? 'Pause' : 'Play'}
      </button>
      <button
        onClick={reset}
        className="px-2 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200"
      >
        Reset
      </button>
    </div>
  );
}
