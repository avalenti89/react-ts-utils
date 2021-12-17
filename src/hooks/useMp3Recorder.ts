import MicRecorder, { Config } from 'mic-recorder-to-mp3';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RecorderStatus } from '../types/RecorderStatus';
import { v4 as uuidV4 } from 'uuid';

export const useMp3Recorder = (config?: Config) => {
	const [status, setStatus] = useState<RecorderStatus>(RecorderStatus.IDLE);

	const recorder = useMemo(
		() =>
			new MicRecorder({
				bitRate: 128,
				...config,
			}),
		[config]
	);

	const mediaDevices = navigator.mediaDevices;
	const isSecured = !!mediaDevices;
	useEffect(() => {
		if (!isSecured) setStatus(RecorderStatus.INSECURE);
	}, [isSecured]);

	const isSupported = isSecured && !!mediaDevices?.getUserMedia;
	useEffect(() => {
		if (!isSupported) setStatus(RecorderStatus.NOT_SUPPORTED);
	}, [isSupported]);

	const start = useCallback(() => {
		if (isSupported) {
			return recorder
				.start()
				.then((a) => {
					setStatus(RecorderStatus.RECORDING);
					return a;
				})
				.catch((e) => {
					setStatus(RecorderStatus.ERROR);
					throw e;
				});
		}
		return Promise.reject(RecorderStatus.NOT_SUPPORTED);
	}, [recorder, isSupported]);

	const stop = useCallback(() => {
		if (isSupported) {
			return recorder
				.stop()
				.getMp3()
				.then(([buffer, blob]) => {
					setStatus(RecorderStatus.STOPPED);
					const file = new File(buffer, `${uuidV4()}.mp3`, {
						type: blob.type,
						lastModified: Date.now(),
					});
					return { file, buffer, blob };
				})
				.catch((e) => {
					setStatus(RecorderStatus.ERROR);
					throw e;
				});
		}
		return Promise.reject(RecorderStatus.NOT_SUPPORTED);
	}, [recorder, isSupported]);

	return {
		start,
		stop,
		status,
		recorder,
		isSupported,
	};
};
