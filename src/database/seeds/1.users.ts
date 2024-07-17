import { Knex } from "knex";

const TABLE_NAME = "users";

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
          id: "750e7bc3-c03b-4218-97bb-191e5be72076",
          name: "Admin",
          email: "admin@gmail.com",
          password:
            "$2b$10$lIaNTBsPLgq6p/2nUlFXiugJvFj6eInDanZiE82Wq/bBxtMU6FD8y",
          permissions: "isAdmin",
        },
        {
          id: "08b8bc54-0439-45f2-ad60-ae3a17d3b0e8",
          name: "joy",
          email: "joi@email.com",
          password: "hashed_Passw00ord",
        },
      ]);
    });
}
