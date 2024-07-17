import expect from "expect";
import sinon from "sinon";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
const { sign } = jwt;
import config from "../../../config";
// import { NotFound, Unauthorized, Internal } from "../../../error";
import { login } from "../../../services/Auth";
import * as UserService from "../../../services/User";
import { NotFound } from "../../../error/NotFound";
import { Unauthorized } from "../../../error/Unauthorized";
import { Internal } from "../../../error/Internal";

describe("Auth Service Test Suite", () => {
  describe("login", () => {
    let userServiceGetUserByEmailStub: sinon.SinonStub;
    let bcryptjsCompareStub: sinon.SinonStub;
    let signStub: sinon.SinonStub;

    const user = {
      id: "1",
      name: "User 1",
      email: "user1@email.com",
      password: "hashedpassword",
      permissions: ["users.get"],
    };

    beforeEach(() => {
      userServiceGetUserByEmailStub = sinon.stub(UserService, "getUserByEmail");
      bcryptjsCompareStub = sinon.stub(bcryptjs, "compare");
      signStub = sinon.stub(jwt, "sign");
    });

    afterEach(() => {
      userServiceGetUserByEmailStub.restore();
      bcryptjsCompareStub.restore();
      signStub.restore();
    });

    it("Should throw NotFound error when user does not exist", async () => {
      userServiceGetUserByEmailStub.returns(undefined);

      await expect(() =>
        login({ email: "nonexistent@email.com", password: "password" })
      ).rejects.toThrow(new NotFound("User does not exist with given email"));
    });

    it("Should throw Unauthorized error when password is invalid", async () => {
      userServiceGetUserByEmailStub.returns(user);
      bcryptjsCompareStub.returns(false);

      await expect(() =>
        login({ email: "user1@email.com", password: "wrongpassword" })
      ).rejects.toThrow(new Unauthorized("Invalid password received"));
    });

    it("Should throw Internal error when JWT secret is not set", async () => {
      userServiceGetUserByEmailStub.returns(user);
      bcryptjsCompareStub.returns(true);
      const originalSecret = config.jwt.secret;
      config.jwt.secret = undefined;

      await expect(() =>
        login({ email: "user1@email.com", password: "password" })
      ).rejects.toThrow(new Internal("Secret not Setup."));

      config.jwt.secret = originalSecret; // Reset the secret for other tests
    });

    it("Should return accessToken and refreshToken on successful login", async () => {
      userServiceGetUserByEmailStub.returns(user);
      bcryptjsCompareStub.returns(true);
      signStub.onFirstCall().returns("accessToken");
      signStub.onSecondCall().returns("refreshToken");

      const tokens = await login({
        email: "user1@email.com",
        password: "password",
      });

      expect(tokens).toStrictEqual({
        accessToken: "accessToken",
        refreshToken: "refreshToken",
      });
    });
  });
});
