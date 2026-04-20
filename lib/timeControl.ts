export const calculateTotalTime = (minutes: number | any, speed: string): number => {
  const baseSeconds = minutes * 60;

  switch (speed) {
    case '0.5':
      return Math.floor(baseSeconds * 0.5);
    case '0.75':
      return Math.floor(baseSeconds * 0.75);
    case '1':
      return baseSeconds;
    case '1.25':
      return Math.floor(baseSeconds * 1.25);
    case '1.5':
      return Math.floor(baseSeconds * 1.5);
    case '1.75':
      return Math.floor(baseSeconds * 1.75);
    case '2':
      return Math.floor(baseSeconds * 2);
    case '3':
      return Math.floor(baseSeconds * 3);
    case 'untimed':
      return Infinity;
    default:
      return baseSeconds;
  }
};

export const formatTime = (seconds: number): string => {
  if (seconds === Infinity) return 'Untimed';

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const startCountdown = (
  initialTime: number,
  onTick: (timeLeft: number) => void,
  onComplete: () => void
): NodeJS.Timeout => {
  let timeLeft = initialTime;

  const timer = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timer);
      onComplete();
      return;
    }

    timeLeft -= 1;
    onTick(timeLeft);
  }, 1000);

  return timer;
};
