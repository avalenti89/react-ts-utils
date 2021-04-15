import { useCallback, useLayoutEffect, useState } from 'react';
import { Size } from '../types/Size';

export const useWindowSize = ():[size:Size| null, start:()=>void, stop:()=>void] => {
	const [windowSize, setWindowSize] = useState<Size | null>(null);

	const handleResize=useCallback(()=>{
		setWindowSize({
			width: window.innerWidth,
			height: window.innerHeight
		});
	},[]);

	const startListener = useCallback(()=>{
		window.addEventListener('resize', handleResize);
	},[handleResize])
	
	const stopListener = useCallback(()=>{
		window.removeEventListener('resize', handleResize)
	},[handleResize]);

	useLayoutEffect(() => {
		handleResize();
		return stopListener;
	}, [handleResize,startListener,stopListener]);

	return [windowSize,startListener,stopListener];
};
