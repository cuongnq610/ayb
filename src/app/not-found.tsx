'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const timeCountDown = 3;
const Custom404 = () => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<number>(timeCountDown);
  useEffect(() => {
    // Redirect to the homepage after 3 seconds
    const redirectTimeout = setTimeout(() => {
      router.push('/');
    }, 1000 * timeCountDown);

    return () => clearTimeout(redirectTimeout);
  }, []);

  useEffect(() => {
    const inter = setInterval(() => {
      setCurrentTime((v) => v - 1);
    }, 1000);
    return () => clearInterval(inter);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-card-content text-white">
      <h1 className="text-4xl font-bold mb-4">Page not found</h1>
      <p className="text-lg">
        Redirecting to <a href="/">homepage</a> in {currentTime} seconds...
      </p>
    </div>
  );
};

export default Custom404;
