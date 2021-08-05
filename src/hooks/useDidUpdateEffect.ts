import { useEffect, useRef } from 'react';

export const useDidUpdateEffect = <T extends Array<any>>(
	callback: (prevs: T) => void,
	inputs: T
) => {
	const prevs = useRef(inputs);
	const didMountRef = useRef(false);

	useEffect(() => {
		if (didMountRef.current) {
			callback(prevs.current);
			prevs.current = inputs;
		} else {
			didMountRef.current = true;
		}
	}, inputs);
};
