export const targetTimeout = (
	_targetTime: Date | string | number,
	callback: () => void,
	options?: { precision?: number; onTick?: () => void }
) => {
	const { precision, onTick } = options ?? {};
	onTick?.();
	let targetTime: Date;
	if (typeof _targetTime === 'string' || typeof _targetTime === 'number') {
		targetTime = new Date(_targetTime);
	} else {
		targetTime = _targetTime;
	}

	if (Date.now() >= targetTime.valueOf()) {
		callback();
	} else {
		window.setTimeout(() => {
			targetTimeout(targetTime, callback, options);
		}, precision ?? 1000);
	}
};
