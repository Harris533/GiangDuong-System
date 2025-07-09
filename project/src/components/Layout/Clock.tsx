import React, { useState, useEffect } from 'react';
import { Clock as ClockIcon } from 'lucide-react';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
      <ClockIcon className="w-4 h-4" />
      <div className="flex flex-col">
        <span className="font-mono font-medium">{formatTime(time)}</span>
        <span className="text-xs">{formatDate(time)}</span>
      </div>
    </div>
  );
};

export default Clock;