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
	mimetype: string;
};

export const useMediaRecorder = (props: IMediaRecorderProps) => {
	const { audio, video, mimetype } = props;

	const [status, setStatus] = useState<MediaRecorderStatus>(
		MediaRecorderStatus.IDLE
	);

	const isSupported = !!navigator.mediaDevices.getUserMedia;
	useEffect(() => {
		if (!isSupported) setStatus(MediaRecorderStatus.NOT_SUPPORTED);
	}, [isSupported]);

	const audioChunks = useRef<Blob[]>([]);
	const mediaRecorder = useRef<MediaRecorder>();

	const setMediaRecorder = useCallback(
		(stream: MediaStream) => {
			const _mediaRecorder = new MediaRecorder(stream);
			_mediaRecorder.addEventListener('start', () => {
				setStatus(MediaRecorderStatus.RECORDING);
			});

			_mediaRecorder.addEventListener('dataavailable', (blob: BlobEvent) => {
				audioChunks.current.push(blob.data);
			});

			_mediaRecorder.addEventListener('stop', () => {
				setStatus(MediaRecorderStatus.STOPPED);
			});

			_mediaRecorder.start();
			mediaRecorder.current = _mediaRecorder;
		},
		[status]
	);

	const blob = useMemo(() => {
		if (!!audioChunks.current.length) {
			return new Blob(audioChunks.current, { type: mimetype });
		}
		return null;
	}, [status, mimetype]); // eslint-disable-line react-hooks/exhaustive-deps

	const startRecording = useCallback(() => {
		audioChunks.current = [];
		if (isSupported) {
			navigator.mediaDevices
				.getUserMedia({ audio, video })
				.then(setMediaRecorder)
				.catch((e) => {
					console.error(e);
					setStatus(MediaRecorderStatus.ERROR);
				});
		}
	}, [isSupported, audio, video, setMediaRecorder]);

	const stopRecording = useCallback(() => {
		if (status === MediaRecorderStatus.RECORDING) {
			mediaRecorder.current?.stream.getTracks().forEach((track) => {
				track.stop();
			});
			mediaRecorder.current?.stop();
		}
	}, [status]);

	return {
		startRecording,
		stopRecording,
		blob,
		audioChunks,
		status,
		isSupported
	};
};
