import { Knex } from "knex";

const TABLE_NAME = "users";

/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid("id", { primaryKey: true, useBinaryUuid: true });
    // .defaultTo(knex.fn.uuid());
    table.string("name", 100).notNullable();
    table.string("email", 100).notNullable().unique();
    table.string("password", 100).notNullable();
    table.string("permissions", 100).notNullable().defaultTo("isUser");
    table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));

    table.uuid("created_by").references("id").inTable(TABLE_NAME).nullable();

    table.timestamp("updated_at").nullable();

    table.uuid("updated_by").references("id").inTable(TABLE_NAME).nullable();
  });
}

/**
 * Drop table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
