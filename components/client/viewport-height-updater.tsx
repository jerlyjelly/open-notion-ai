'use client';

import { useEffect } from 'react';

export function ViewportHeightUpdater() {
  useEffect(() => {
    function updateVh() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // Set the initial value
    updateVh();

    // Add event listener for window resize
    window.addEventListener('resize', updateVh);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', updateVh);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount and cleans up on unmount

  return null; // This component doesn't render anything
} 