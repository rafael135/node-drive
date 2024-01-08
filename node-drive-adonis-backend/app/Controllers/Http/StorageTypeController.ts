import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StorageType from 'App/Models/StorageType'

export default class StorageTypeController {

	public static async getStorageById(storageId: number) {
		let storage = await StorageType.find(storageId);

		return storage;
	}

	public async getStorageTypes({ response }: HttpContextContract) {
		let storageTypes = await StorageType.findMany([3, 2, 1]);

		response.status(200);
		return response.send({
			storageTypes: storageTypes,
			status: 200
		});
	}


}
