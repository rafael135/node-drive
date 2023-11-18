import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
	constructor (protected app: ApplicationContract) {
	}

	public register () {
		// Register your own bindings
	}

	public async boot () {
		// IoC container is ready
		const { publicUserDriver } = await import("./publicUserProvider/index");
		const Drive = this.app.container.use("Adonis/Core/Drive");

		Drive.extend("publicUser", (_drive, _diskName, config) => {
			return new publicUserDriver(config);
		});
	}

	public async ready () {
		// App is ready
	}

	public async shutdown () {
		// Cleanup, since app is going down
	}
}
