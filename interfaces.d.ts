interface CloudDeviceEmitter {
	on(event: string, listener: Function): this;
	getCurrentlyAttachedDevices(): IAttachedDevices;
	dispose(): void;
}

interface IAttachedDevices {
	[key: string]: ICloudEmulatorDeviceBasicInfo;
}

interface ICloudEmulatorDeviceBasicInfo {
	identifier: string;
	publicKey: string;
	model: string;
	os: string;
}

interface ICloudDeviceServerInfo {
	port: number;
	host: string;
}
