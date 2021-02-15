import { useCallback, useState } from 'react';

export const useToggle = (
	initialValue: boolean = false
): [boolean, (newValue?: boolean) => void] => {
	const [value, setValue] = useState(initialValue);

	const toggle = useCallback(
		(newValue?: boolean) => setValue(newValue ?? !value),
		[value]
	);

	return [value, toggle];
};
