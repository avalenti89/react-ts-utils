import { useCallback, useRef, useState } from "react";

export const useDebounce = (
	millis: number,
	reset: boolean = true
): [count: number, trigger: () => void] => {
	const __count = useRef(0);
	const [_count, set_count] = useState(0);
	const trigger = useCallback(() => {
		if (__count.current === 0) {
			window.setTimeout(() => {
				set_count(__count.current);
				if(reset){
					__count.current = 0;
				}
			}, millis);
		}
		__count.current++;
	}, [ millis,reset]);
	return [_count, trigger];
};