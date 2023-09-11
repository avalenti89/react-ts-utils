import classNames from 'classnames';
import React, { useState, useEffect } from 'react';

export const useMountTransition = (
	isMounted: boolean,
	unmountDelay: number,
	prefix?: string
) => {
	const [hasTransitionedIn, setHasTransitionedIn] = useState(false);

	useEffect(() => {
		let timeoutId: number;

		if (isMounted && !hasTransitionedIn) {
			setHasTransitionedIn(true);
		} else if (!isMounted && hasTransitionedIn) {
			timeoutId = window.setTimeout(
				() => setHasTransitionedIn(false),
				unmountDelay
			);
		}

		return () => {
			window.clearTimeout(timeoutId);
		};
	}, [unmountDelay, isMounted, hasTransitionedIn]);

	const $prefix = prefix ? prefix + '-' : '';

	const classes = classNames(
		hasTransitionedIn && `${$prefix}in`,
		isMounted && `${$prefix}visible`
	);

	return classes || undefined;
};
