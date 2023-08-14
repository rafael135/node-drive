import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string("name", 200).notNullable();
      table.string("email", 200).notNullable();
      table.string("password", 250).notNullable();
      table.integer("storage_type_id").nullable();
      table.foreign("storage_type_id", "id").references("storage_types");
      table.string("files_path", 100).nullable();

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign("storageTypeId");
    });

    this.schema.dropTable(this.tableName)
  }
}
