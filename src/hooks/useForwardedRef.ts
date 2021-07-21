import { MutableRefObject, useEffect, useRef } from 'react';

export const useForwardedRef = <T extends HTMLElement>(ref?: React.Ref<T> | null) => {
	const innerRef = useRef<T>(null);
	useEffect(() => {
		if (!ref) return;
		if (typeof ref === 'function') {
			ref(innerRef.current);
		} else {
			(ref as MutableRefObject<T | null>).current = innerRef.current;
		}
	});

	return innerRef;
};
