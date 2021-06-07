import * as React from 'react';

import { CacheProvider } from '@emotion/react';
import createCache, { EmotionCache, Options } from '@emotion/cache';

type Props = Options & {
	children: React.ReactNode;
};

export default function EmotionStyleSheetProvider({
	children,
	...props
}: Props): React.ReactElement {
	const [cache, setCache] = React.useState<EmotionCache | null>(null);

	React.useEffect(() => {
		setCache(createCache(props));
	}, [props]);

	return (
		<>
			{cache != null && <CacheProvider value={cache}>{children}</CacheProvider>}
		</>
	);
}
