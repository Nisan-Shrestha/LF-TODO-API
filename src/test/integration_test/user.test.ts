import request from "supertest";

import express from "express";
import router from "../../routes";
import expect from "expect";
import { users } from "../../model/user";
describe("User Integration Test Suite", () => {
  const app = express();
  app.use(express.json());

  app.use(router);

  describe("Create User API test", () => {
    it("Should create new user", async () => {
      const response = await request(app)
        .post("/users")
        .send({
          name: "User 3",
          email: "user@gmail.com",
          password: "test1234!A",
          id: "2",
          permissions: ["users.get"],
        });
      // console.log(get);
      console.log(users);
      // expect(response);
    });
  });
});
