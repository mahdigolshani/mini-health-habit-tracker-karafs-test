import {useCallback, useEffect, useRef, useState} from 'react';
interface Params {
  from: number;
  to?: number;
  interval?: number;
}
export const useCountInterval = ({from, to = 0, interval = 1000}: Params) => {
  const [counter, setCounter] = useState(from);
  const [isRunning, setIsRunning] = useState(from !== to);

  const intervalId = useRef<ReturnType<typeof setInterval>>();

  const start = useCallback(() => {
    setIsRunning(!(to !== undefined && counter === to));
  }, [to, counter]);

  const pause = useRef(() => setIsRunning(false)).current;
  const reset = useCallback(
    (resetFrom?: number) => {
      clearInterval(intervalId.current);
      setCounter(resetFrom === undefined ? from : resetFrom);
      setIsRunning(true);
    },
    [from],
  );

  useEffect(() => {
    intervalId.current = setInterval(() => {
      if (isRunning) setCounter(prev => (from > to ? prev - 1 : prev + 1));
      if (
        to !== undefined &&
        (from > to ? counter <= to + 1 : counter >= to - 1)
      ) {
        pause();
        clearInterval(intervalId.current);
      }
    }, interval);
    return () => clearInterval(intervalId.current);
  }, [isRunning, counter, interval, to]);

  return {counter, start, pause, reset, isRunning};
};
