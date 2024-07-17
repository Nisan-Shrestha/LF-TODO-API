import { Knex } from "knex";
import { TaskStatus } from "../../interfaces/Task";

const TABLE_NAME = "tasks";

/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid("task_id", { primaryKey: true, useBinaryUuid: true });
    table
      .uuid("user_id", { useBinaryUuid: true })
      .references("id")
      .inTable("users")
      .notNullable();

    table.string("detail", 1000).notNullable();
    table
      .enum("status", Object.values(TaskStatus))
      .notNullable()
      .defaultTo(TaskStatus.pending);

    table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));

    table.timestamp("updated_at").nullable();
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
