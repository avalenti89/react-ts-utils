import { useEffect, useRef, useState } from 'react';
import { setDelay } from '@avalenti89/typescript-utils';

/**
 *
 * @param retry retry until false
 * @param options provide at least one
 *
 * @return [start()=>void,stop()=>void,running: boolean, remainingTime: number | undefined, targetTime: number | undefined]
 */
export const useRetry = (
	retry: (attempt: number) => boolean,
	options?: {
		delay?: number;
	}
): [
	() => void,
	() => void,
	boolean,
	number | undefined,
	number | undefined
] => {
	const { delay } = options ?? {};
	const attempt = useRef(0);

	const [isRunning, setRunning] = useState(false);

	const [remainingTime, setRemainingTime] = useState<number>();

	const targetTime = useRef<number>();

	const timer = useRef<() => void>();

	useEffect(() => {
		if (isRunning) {
			targetTime.current = delay ? Date.now() + delay : undefined;
		} else {
			targetTime.current = undefined;
			setRemainingTime(undefined);
		}
		attempt.current = 0;
	}, [isRunning]);

	useEffect(() => {
		if (targetTime.current && isRunning) {
			timer.current = setDelay(
				targetTime.current,
				() => {
					attempt.current++;
					const repeat = retry(attempt.current);
					if (repeat) {
						targetTime.current = Date.now() + (delay ?? 0);
						return;
					}
					timer.current?.();
					setRunning(false);
					return;
				},
				(_remainingTime) => setRemainingTime(_remainingTime)
			);
		}
		return timer.current;
	}, [isRunning, delay, retry]);

	return [
		() => setRunning(true),
		() => setRunning(false),
		isRunning,
		remainingTime,
		targetTime.current
	];
};
