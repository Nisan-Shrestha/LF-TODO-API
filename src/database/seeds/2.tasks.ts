import { Knex } from "knex";
import { TaskStatus } from "../../interfaces/Task";

const TABLE_NAME = "tasks";

/**
 * Delete existing entries and seed values for table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export function seed(knex: Knex): Promise<void> {
  return knex(TABLE_NAME)
    .del()
    .then(() => {
      return knex(TABLE_NAME).insert([
        {
          task_id: "08b8bc54-0439-45f2-ad60-ae3a17d3b0b7",
          user_id: "750e7bc3-c03b-4218-97bb-191e5be72076",
          detail: "Do the things that need to be done",
          status: TaskStatus.pending,
        },
        {
          task_id: "08b8bc54-0439-45f2-ad60-ae3a17d3b0d7",
          user_id: "08b8bc54-0439-45f2-ad60-ae3a17d3b0e8",
          detail: "Make the things that need to happen happen",
        },
      ]);
    });
}
