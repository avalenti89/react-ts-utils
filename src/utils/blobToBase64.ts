export const blobToBase64 = (blob: Blob) => {
	const reader = new FileReader();
	reader.readAsDataURL(blob);
	return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
		reader.onloadend = () => {
			resolve(reader.result);
		};
		reader.onerror = (error) => reject(error);
	});
};
