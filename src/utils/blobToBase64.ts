export const blobToBase64 = (blob: Blob) => {
	const reader = new FileReader();
	reader.readAsDataURL(blob);
	return new Promise((resolve, reject) => {
		reader.onloadend = () => {
			resolve(reader.result);
		};
		reader.onerror = (error) => reject(error);
	});
};
