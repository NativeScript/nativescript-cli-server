declare module "nativescript-cli-server" {
	function getServerAddress(): Promise<any>;
	function killServer(): Promise<any>;
	var deviceEmitter: any;
	var IOSDeviceLib: any;
}
