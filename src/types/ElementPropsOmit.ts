export type ElementPropsOmit<
	T extends keyof JSX.IntrinsicElements,
	O extends keyof JSX.IntrinsicElements[T] = never
> = Omit<JSX.IntrinsicElements[T], O>;
