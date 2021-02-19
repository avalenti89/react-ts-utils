import { useCallback, useEffect, useRef, useState } from 'react';

/**
 *
 * @param retry retry until false
 * @param options provide at least one
 *
 * @return [ start( delay?: number ) , stop() ]
 */
export const useRetry = (
  retry: (attempt: number, bail: () => void) => boolean,
  options?: {
    delay?: number;
  }
) => {
  const { delay } = options ?? {};
  const attempt = useRef(0);
  const [next, setNext] = useState<number>();

  const start = useCallback(
    (delay?: number) => setNext(Date.now() + (delay ?? 0)),
    []
  );
  const stop = useCallback(() => setNext(0), []);

  const timer = useRef<number>();

  useEffect(() => {
    attempt.current = 0;
  }, [delay, retry]);

  useEffect(() => {
    window.clearInterval(timer.current);
    if (next) {
      attempt.current++;
      const { current: _attempt } = attempt;
      timer.current = window.setInterval(() => {
        const now = Date.now();
        if (next <= now) {
          const _retry = retry(_attempt, stop);
          if (_retry) {
            start(delay);
          } else {
            stop();
          }
        }
      });
    }
  }, [next, delay, start, stop, retry]);

  return [start, stop];
};
