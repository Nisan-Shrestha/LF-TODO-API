import {
  createUser,
  getAllUser,
  getUserInfo,
  updateUser,
  deleteUser,
  getUserByEmail,
} from "../../../services/User";
import expect from "expect";
import sinon from "sinon";

import * as UserModel from "../../../models/User";
import { permission } from "process";
import bcrypt from "bcrypt";
import { create } from "domain";
import { IUser } from "../../../interfaces/User";
import { UUID } from "crypto";
import { perms } from "../../../utils/permission";
import { Conflict } from "../../../error/Conflict";

describe("User Service Test Suite", () => {
  describe("getUserInfo", () => {
    let userModelGetUserByIdStub: sinon.SinonStub;

    beforeEach(() => {
      userModelGetUserByIdStub = sinon.stub(UserModel, "getUserInfo");
    });

    afterEach(() => {
      userModelGetUserByIdStub.restore();
    });

    it("Should throw error when user is not found ", async () => {
      userModelGetUserByIdStub.returns(undefined);

      await expect(() => getUserInfo("100" as UUID)).rejects.toThrow(
        new Error("User with id: 100 not found")
      );
    });

    it("Should return the user when user is found", async () => {
      const user = {
        id: "1",
        name: "User 1",
        email: "user1@email.com",
        password: "test1234",
        permissions: ["users.get"],
      };
      userModelGetUserByIdStub.returns(user);
      const res = await getUserInfo("1" as UUID);
      expect(res).toStrictEqual(user);
    });
  });

  describe("createUser", () => {
    let bcryptHashStub: sinon.SinonStub;
    let userModelCreateUserStub: sinon.SinonStub;
    let userModelGetUserByEmailStub: sinon.SinonStub;

    beforeEach(() => {
      bcryptHashStub = sinon.stub(bcrypt, "hash");
      userModelCreateUserStub = sinon.stub(UserModel, "createUser");
      userModelGetUserByEmailStub = sinon.stub(UserModel, "getUserByEmail");
    });

    afterEach(() => {
      bcryptHashStub.restore();
      userModelCreateUserStub.restore();
      userModelGetUserByEmailStub.restore();
    });

    it("Should throw conflict error when user already exists", async () => {
      bcryptHashStub.resolves("hashedPassword");
      const user = {
        id: "1" as UUID,
        name: "User 1",
        email: "user1@email.com",
        password: "hashedPassword",
        permissions: perms.userPerms,
      };
      userModelGetUserByEmailStub.returns(user);

      await expect(
        createUser({
          id: "2" as UUID,
          name: "User 2",
          email: "user1@email.com",
          password: "hashedPassword",
          permissions: perms.userPerms,
        } as IUser)
      ).rejects.toThrow(
        new Conflict("User with email user1@email.com already exists")
      );
    });

    it("Should create a new user when user does not exist", async () => {
      userModelGetUserByEmailStub.returns(undefined);
      bcryptHashStub.resolves("hashedPassword");
      const userR = {
        id: "2" as UUID,
        name: "User 2",
        email: "user2@email.com",
        password: "hashedPassword",
        permissions: perms.userPerms,
      };
      userModelCreateUserStub.returns({
        id: "2" as UUID,
        name: "User 2",
        email: "user2@email.com",
        password: "hashedPassword",
        permissions: perms.userPerms,
      });

      const user = await createUser({
        id: "2" as UUID,
        name: "User 2",
        email: "user1@email.com",
        password: "hashedPassword",
        permissions: perms.userPerms,
      } as IUser);

      expect(user).toStrictEqual({
        id: "2",
        name: "User 2",
        email: "user2@email.com",
      });
    });
  });
});
