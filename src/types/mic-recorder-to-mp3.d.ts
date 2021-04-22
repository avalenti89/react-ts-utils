declare module 'mic-recorder-to-mp3' {
	interface Config {
		bitRate?: number;
		startRecordingAt?: number;
	}
	export default class MicRecorder {
		constructor(config: Config);
		start(): Promise<MediaStream>;
		stop(): {
			getMp3(): Promise<[Buffer[], Blob]>;
		};
	}
}
