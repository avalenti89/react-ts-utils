import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RecorderStatus } from '../types/RecorderStatus';

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

	const [status, setStatus] = useState<RecorderStatus>(RecorderStatus.IDLE);

	const isSupported = !!navigator.mediaDevices.getUserMedia;
	useEffect(() => {
		if (!isSupported) setStatus(RecorderStatus.NOT_SUPPORTED);
	}, [isSupported]);

	const audioChunks = useRef<Blob[]>([]);
	const mediaRecorder = useRef<MediaRecorder>();

	const setMediaRecorder = useCallback(
		(stream: MediaStream) => {
			const _mediaRecorder = new MediaRecorder(stream);
			_mediaRecorder.addEventListener('start', () => {
				setStatus(RecorderStatus.RECORDING);
			});

			_mediaRecorder.addEventListener('dataavailable', (blob: BlobEvent) => {
				audioChunks.current.push(blob.data);
			});

			_mediaRecorder.addEventListener('stop', () => {
				setStatus(RecorderStatus.STOPPED);
			});

			_mediaRecorder.addEventListener('error', (e) => {
				console.error(e.error);
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
					setStatus(RecorderStatus.ERROR);
				});
		}
	}, [isSupported, audio, video, setMediaRecorder]);

	const stopRecording = useCallback(() => {
		if (status === RecorderStatus.RECORDING) {
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
