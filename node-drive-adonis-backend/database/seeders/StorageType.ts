import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import StorageType from 'App/Models/StorageType';

export default class extends BaseSeeder {
	public async run () {
		// Write your database queries inside the run method
		await StorageType.createMany([
			{
				title: "Gratuito",
				storageSize: 5,
				maxSharedFiles: 5
			},
			{
				title: "Básico",
				storageSize: 100,
				maxSharedFiles: 20,
				price: 4.99
			},
			{
				title: "Pro",
				storageSize: 200,
				price: 8.99
			}
		]);
	}
}
