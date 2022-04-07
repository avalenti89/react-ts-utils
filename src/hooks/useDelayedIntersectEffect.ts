import useIntersectionObserver from '@react-hook/intersection-observer';
import React, { useRef, useEffect, useState } from 'react';

export const useDelayedIntersectEffect = (
	ref: React.RefObject<HTMLElement> | null = null,
	callback: () => void,
	delay: number
) => {
	const { isIntersecting } = useIntersectionObserver(ref, {
		threshold: 0.25,
	});

	const [visible, setVisible] = useState(false);
	const timeoutc = useRef<number>();

	useEffect(() => {
		setVisible(document.visibilityState === 'visible');
		document.addEventListener('visibilitychange', () => {
			setVisible(document.visibilityState === 'visible');
		});
		return () => window.clearTimeout(timeoutc.current);
	}, []);

	useEffect(() => {
		if (isIntersecting && callback && visible) {
			timeoutc.current = window.setTimeout(() => {
				callback();
			}, delay);
		}
	}, [isIntersecting, callback, visible, delay]);
};
