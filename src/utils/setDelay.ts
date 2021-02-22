/**
 *
 * @param delay number of milliseconds to wait before execute callback
 * @param callback the function that you want execute
 * @param tick optional parameter that sets check frequency
 *
 * @return function that stops delay check
 */
export const setDelay = (
  delay: number,
  callback: () => void,
  getRemainingTime: (remainingTime: number) => void,
  tick: number = 1000
): (() => void) => {
  const targetTime = Date.now() + delay;

  const timer = window.setInterval(() => {
    if (!targetTime) {
      return window.clearInterval(timer);
    }
    const now = Date.now();
    if (targetTime <= now) {
      callback();
      return window.clearInterval(timer);
    }
    return getRemainingTime(targetTime - now);
  }, tick);
  return () => window.clearInterval(timer);
};
