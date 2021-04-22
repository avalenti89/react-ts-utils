import MicRecorder, { Config } from 'mic-recorder-to-mp3';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RecorderStatus } from '../types/RecorderStatus';

export const useMp3Recorder = (config?: Config) => {
	const [status, setStatus] = useState<RecorderStatus>(RecorderStatus.IDLE);

	const [blob, setBlob] = useState<Blob>();
	const [buffer, setBuffer] = useState<Buffer[]>();

	const recorder = useMemo(
		() =>
			new MicRecorder({
				bitRate: 128,
				...config
			}),
		[config]
	);

	const isSupported = !!navigator.mediaDevices.getUserMedia;
	useEffect(() => {
		if (!isSupported) setStatus(RecorderStatus.NOT_SUPPORTED);
	}, [isSupported]);

	const start = useCallback(() => {
		if (isSupported) {
			recorder
				.start()
				.then(() => {
					setStatus(RecorderStatus.RECORDING);
				})
				.catch((e) => {
					console.error(e);
					setStatus(RecorderStatus.ERROR);
				});
		}
	}, [recorder, isSupported]);

	const stop = useCallback(() => {
		if (isSupported) {
			recorder
				.stop()
				.getMp3()
				.then(([_buffer, _blob]) => {
					setBlob(_blob);
					setBuffer(_buffer);
					setStatus(RecorderStatus.STOPPED);
				})
				.catch((e) => {
					console.log(e);
					setStatus(RecorderStatus.ERROR);
				});
		}
	}, [recorder, isSupported]);

	return {
		start,
		stop,
		blob,
		buffer,
		status,
		recorder,
		isSupported
	};
};
