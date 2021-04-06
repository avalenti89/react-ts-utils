export const readingTime = (text: string = '', speed: number = 400) => {
	if (!text.length) return 0;
	return text.split(' ').length * speed;
};
