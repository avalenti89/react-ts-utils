export const targetTimeout = (
	_targetTime: Date | string | number,
	callback: () => void,
	options?: { precision?: number; onTick?: (stop: () => void) => void }
) => {
	const { precision, onTick } = options ?? {};
	let targetTime: Date;
	if (typeof _targetTime === 'string' || typeof _targetTime === 'number') {
		targetTime = new Date(_targetTime);
	} else {
		targetTime = _targetTime;
	}

	if (Date.now() >= targetTime.valueOf()) {
		callback();
	} else {
		const timeoutc = window.setTimeout(() => {
			targetTimeout(targetTime, callback, options);
		}, precision ?? 1000);
		onTick?.(() => window.clearTimeout(timeoutc));
	}
};
