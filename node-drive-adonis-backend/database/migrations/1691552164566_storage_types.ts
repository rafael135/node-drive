import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
	protected tableName = 'storage_types'

	public async up () {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');

			table.string("title");
			table.integer("storage_size");
			table.float("price").nullable();
			table.integer("max_shared_files").nullable();

			/**
			 * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
			 */
			table.timestamp('created_at', { useTz: true })
			table.timestamp('updated_at', { useTz: true })
		})
	}

	public async down () {
		this.schema.dropTable(this.tableName)
	}
}
