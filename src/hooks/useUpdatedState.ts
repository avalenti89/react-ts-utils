import { useState } from 'react';
import { useDidUpdateEffect } from './useDidUpdateEffect';

export const useUpdatedState = <T>(state: T) => {
	const [_state, setState] = useState(state);
	useDidUpdateEffect(() => setState(state), [state]);
	return [_state, setState];
};
