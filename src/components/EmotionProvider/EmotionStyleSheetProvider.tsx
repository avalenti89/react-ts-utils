import React from 'react';
import { CacheProvider } from '@emotion/react';
import createCache, { EmotionCache, Options } from '@emotion/cache';

export const EmotionStyleSheetProvider = ({
	children,
	...props
}: React.PropsWithChildren<Options>) => {
	const [cache, setCache] = React.useState<EmotionCache | null>(null);

	React.useEffect(() => {
		setCache(createCache(props));
	}, [props]);

	if (cache === null) return null;

	return <CacheProvider value={cache}>{children}</CacheProvider>;
};
