import { useMemo } from 'react';
import { useWindowSize } from './useWindowSize';

/**
 * [key]: max | [max,min]
 */
type MediaQueries = { [key: string]: number | [number, number] };

export const useMedia = (mediaqueries: MediaQueries) => {
	const [windowSize] = useWindowSize();
	const { width } = windowSize ?? {};
	const mqEntries = Object.entries(mediaqueries);

	const mqSorted = useMemo(
		() =>
			mqEntries
				.map(([key, value]) => {
					const [max, min] = Array.isArray(value) ? value : [value];
					return { key, max, min: typeof min === 'undefined' ? 0 : min };
				})
				.sort(({ max: maxA }, { max: maxB }) => maxA - maxB),
		[mediaqueries]
	);

	const result = useMemo(() => {
		if (typeof width === 'undefined') return null;
		return (
			mqSorted.find(({ max, min }) => width < max && width >= min)?.key ?? null
		);
	}, [width, mqSorted]);

	return result;
};
