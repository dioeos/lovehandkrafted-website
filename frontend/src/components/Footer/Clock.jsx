import { useEffect, useState } from 'react';

const PhilippinesClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const updateTime = () => setTime(new Date());

    updateTime();

    const now = new Date();
    const delay = (60 - now.getSeconds()) * 1000;

    const timeout = setTimeout(() => {
      updateTime();
      const interval = setInterval(updateTime, 60000);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-PH', {
    timeZone: 'Asia/Manila',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const formattedDay = time.toLocaleDateString('en-PH', {
    timeZone: 'Asia/Manila',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="satoshi text-white text-[.7rem] md:text-[1rem]">
      <div>{formattedDay}</div>
      <div>{formattedTime}</div>
    </div>
  );
};

export default PhilippinesClock;
