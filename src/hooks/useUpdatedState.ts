import { useState } from 'react';
import { useDidUpdateEffect } from './useDidUpdateEffect';

export const useUpdatedState = <T>(
	state: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
	const [_state, setState] = useState(state);
	useDidUpdateEffect(() => setState(state), [state]);
	return [_state, setState];
};
