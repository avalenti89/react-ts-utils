import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

enum Status {
	IDLE = 'idle',
	INVALID_CONSTRAINTS = 'invalid_constraints',
	RECORDING = 'recording',
	STOPPED = 'stopped'
}

type IMediaRecorderProps = (
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

	const isSupported = useMemo(() => {
		return !!navigator.mediaDevices.getUserMedia;
	}, []);
	const [status, setStatus] = useState<Status>(Status.IDLE);
	const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
	const audioChunks = useRef<Blob[]>([]);

	useEffect(() => {
		if (mediaRecorder) {
			const dataavailable = (event: BlobEvent) => {
				audioChunks.current.push(event.data);
			};
			mediaRecorder.addEventListener('dataavailable', dataavailable);

			const stop = () => {
				setStatus(Status.STOPPED);
			};
			mediaRecorder.addEventListener('stop', stop);
			mediaRecorder.start();
			setStatus(Status.RECORDING);
			return () => {
				mediaRecorder.removeEventListener('dataavailable', dataavailable);
				mediaRecorder.removeEventListener('stop', stop);
			};
		}
		return;
	}, [mediaRecorder]);

	const blob = useMemo(() => {
		if (!!audioChunks.current.length) {
			return new Blob(audioChunks.current, { type });
		}
		return null;
	}, [status, type]); // eslint-disable-line react-hooks/exhaustive-deps

	const startRecording = useCallback(() => {
		if (isSupported) {
			navigator.mediaDevices.getUserMedia({ audio, video }).then((stream) => {
				setMediaRecorder(new MediaRecorder(stream));
			});
		}
	}, [isSupported, audio, video]);

	const stopRecording = useCallback(() => {
		mediaRecorder?.stream.getTracks().forEach((track) => {
			track.stop();
		});
	}, [mediaRecorder]);

	return {
		startRecording,
		stopRecording,
		blob,
		audioChunks,
		status
	};
};
