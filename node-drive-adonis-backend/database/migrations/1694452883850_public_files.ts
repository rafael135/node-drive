import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
	protected tableName = 'public_files'

	public async up () {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');

			table.integer("user_id").unsigned();
			table.foreign("user_id", "id").references("users");

			table.string("file_url", 255).unique();
			table.string("file_path", 255);

			/**
			 * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
			 */
			table.timestamp('created_at', { useTz: true })
			table.timestamp('updated_at', { useTz: true })
		})
	}

	public async down () {
		this.schema.table(this.tableName, (table) => {
			table.dropForeign("user_id");
		});

		this.schema.dropTable(this.tableName)
	}
}
