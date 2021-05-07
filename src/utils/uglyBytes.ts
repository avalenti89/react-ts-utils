export const uglyBytes = (text: string) => {
	const powers = { '0': 0, k: 1, m: 2, g: 3, t: 4 };
	const regex = /(\d+(?:\.\d+)?)\s?(k|m|g|t)?b?/i;

	const res = regex.exec(text);
	const value = Number(res?.[1] ?? 0);
	const power = (res?.[2]?.toLowerCase() ?? '0') as keyof typeof powers;

	return (!isNaN(value) ? value : 0) * Math.pow(1024, powers[power]);
};
