import request from "supertest";
import express from "express";
import router from "../../routes";
import expect from "expect";
import jwt from "jsonwebtoken";
import config from "../../config";
import { IUser } from "../../interfaces/User";

describe("Auth Integration Test Suite", () => {
  // if (this) this.timeout(10000); // Increase timeout to 10 seconds for all tests in this suite
  const app = express();
  app.use(express.json());
  app.use(router);

  describe("Login API test", () => {
    it("Should login user and return tokens", async () => {
      const userCredentials = {
        email: "Shrestha@gmail.com",
        password: "Shrestha",
      };

      const response = await request(app)
        .post("/auth/login")
        .send(userCredentials);

      expect(response.status).toBe(202);
      expect(response.body).toHaveProperty("message", "Login successfull");
      expect(response.body).toHaveProperty("payload");
      expect(response.body.payload).toHaveProperty("accessToken");
      expect(response.body.payload).toHaveProperty("refreshToken");

      // Verify the tokens
      const decodedAccessToken = jwt.verify(
        response.body.payload.accessToken,
        config.jwt.secret!
      ) as IUser;
      const decodedRefreshToken = jwt.verify(
        response.body.payload.refreshToken,
        config.jwt.secret!
      ) as IUser;

      expect(decodedAccessToken.email).toBe(userCredentials.email);
      expect(decodedRefreshToken.email).toBe(userCredentials.email);
    });

    it.only("Should return 401 for invalid password", async () => {
      const invalidCredentials = {
        email: "Shrestha@gmail.com",
        password: "wrongpassword",
      };

      const response = await request(app)
        .post("/auth/login")
        .send(invalidCredentials);
      console.log("BODY:",response.body)
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Login Failed");
    });
  });
});
