import { useState, useEffect } from 'react';

export function useTypewriter(
  text: string,
  speed: number = 38,
  startDelay: number = 600
): { displayed: string; done: boolean } {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);

    let intervalId: number | undefined;
    const timeoutId = window.setTimeout(() => {
      let currentIndex = 0;
      intervalId = window.setInterval(() => {
        currentIndex += 1;
        setDisplayed(text.slice(0, currentIndex));
        if (currentIndex >= text.length) {
          if (intervalId !== undefined) {
            window.clearInterval(intervalId);
          }
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

