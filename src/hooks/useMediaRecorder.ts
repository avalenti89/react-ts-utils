import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export enum MediaRecorderStatus {
	IDLE = 'idle',
	INVALID_CONSTRAINTS = 'invalid_constraints',
	RECORDING = 'recording',
	STOPPED = 'stopped',
	ERROR = 'error',
	NOT_SUPPORTED = 'not_supported'
}

export type IMediaRecorderProps = (
	| {
			audio: true | MediaTrackConstraints;
			video?: boolean | MediaTrackConstraints;
	  }
	| {
			audio?: boolean | MediaTrackConstraints;
			video: true | MediaTrackConstraints;
	  }
) & {
	type: string;
};

export const useMediaRecorder = (props: IMediaRecorderProps) => {
	const { audio, video, type } = props;

	const [status, setStatus] = useState<MediaRecorderStatus>(
		MediaRecorderStatus.IDLE
	);

	const isSupported = useMemo(() => {
		return !!navigator.mediaDevices.getUserMedia;
	}, []);
	useEffect(() => {
		if (!isSupported) setStatus(MediaRecorderStatus.NOT_SUPPORTED);
	}, [isSupported]);

	const audioChunks = useRef<Blob[]>([]);
	const mediaRecorder = useRef<MediaRecorder>();

	const setMediaRecorder = useCallback((_mediaRecorder?: MediaRecorder) => {
		if (_mediaRecorder) {
			_mediaRecorder.addEventListener('dataavailable', (event: BlobEvent) => {
				audioChunks.current.push(event.data);
			});

			_mediaRecorder.addEventListener('stop', () => {
				setStatus(MediaRecorderStatus.STOPPED);
			});

			_mediaRecorder.start();
		}
		mediaRecorder.current = _mediaRecorder;
	}, []);

	const blob = useMemo(() => {
		if (!!audioChunks.current.length) {
			return new Blob(audioChunks.current, { type });
		}
		return null;
	}, [status, type]); // eslint-disable-line react-hooks/exhaustive-deps

	const startRecording = useCallback(() => {
		if (isSupported) {
			setStatus(MediaRecorderStatus.RECORDING);
			navigator.mediaDevices
				.getUserMedia({ audio, video })
				.then((stream) => {
					setMediaRecorder(new MediaRecorder(stream));
				})
				.catch((e) => {
					console.error(e);
					setStatus(MediaRecorderStatus.ERROR);
				});
		}
	}, [isSupported, audio, video, setMediaRecorder]);

	const stopRecording = useCallback(() => {
		mediaRecorder.current?.stream.getTracks().forEach((track) => {
			track.stop();
		});
	}, []);

	return {
		startRecording,
		stopRecording,
		blob,
		audioChunks,
		status,
		isSupported
	};
};
