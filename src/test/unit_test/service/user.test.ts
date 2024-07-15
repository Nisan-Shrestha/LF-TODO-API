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
      userModelCreateUserStub.restore();
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
      const stubbedUser = {
        id: "2" as UUID,
        name: "User 2",
        email: "user2@email.com",
        password: "hashedPassword",
        permissions: perms.userPerms,
      };
      userModelCreateUserStub.returns(stubbedUser);

      const user = await createUser({
        id: "2" as UUID,
        name: "User 2",
        email: "user2@email.com",
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

  describe("getAllUser", () => {
    let userModelGetAllUserStub: sinon.SinonStub;

    beforeEach(() => {
      userModelGetAllUserStub = sinon.stub(UserModel, "getAllUser");
    });

    afterEach(() => {
      userModelGetAllUserStub.restore();
    });

    it("Should return all users", async () => {
      const users = [
        { id: "1", name: "User 1", email: "user1@email.com" },
        { id: "2", name: "User 2", email: "user2@email.com" },
      ];
      userModelGetAllUserStub.returns(users);

      const res = await getAllUser();

      expect(res).toStrictEqual(users);
    });

    it("Should return an empty array when no users are found", async () => {
      userModelGetAllUserStub.returns([]);

      const res = await getAllUser();

      expect(res).toStrictEqual([]);
    });
  });

  describe("updateUser", () => {
    let userModelUpdateUserStub: sinon.SinonStub;

    beforeEach(() => {
      userModelUpdateUserStub = sinon.stub(UserModel, "updateUser");
    });

    afterEach(() => {
      userModelUpdateUserStub.restore();
    });

    it("Should update user data", async () => {
      const user = {
        id: "1",
        name: "Updated User",
        email: "updateduser@email.com",
      };
      userModelUpdateUserStub.returns(user);

      const res = await updateUser("1" as UUID, { name: "Updated User" });

      expect(res).toStrictEqual(user);
    });

    it("Should throw an error when user is not found", async () => {
      userModelUpdateUserStub.returns(null);

      await expect(() =>
        updateUser("100" as UUID, { name: "Updated User" })
      ).rejects.toThrow(new Error("User with id: 100 not found"));
    });
  });

  describe("deleteUser", () => {
    let userModelDeleteUserStub: sinon.SinonStub;

    beforeEach(() => {
      userModelDeleteUserStub = sinon.stub(UserModel, "deleteUser");
    });

    afterEach(() => {
      userModelDeleteUserStub.restore();
    });

    it("Should delete user when user is found", async () => {
      userModelDeleteUserStub.returns(true);

      const res = await deleteUser("1" as UUID);

      expect(res).toStrictEqual({ message: "User deleted Successfully" });
    });

    it("Should throw an error when user is not found", async () => {
      userModelDeleteUserStub.returns(false);

      await expect(() => deleteUser("100" as UUID)).rejects.toThrow(
        new Error("User with id: 100 not found")
      );
    });
  });

  describe("getUserByEmail", () => {
    let userModelGetUserByEmailStub: sinon.SinonStub;

    beforeEach(() => {
      userModelGetUserByEmailStub = sinon.stub(UserModel, "getUserByEmail");
    });

    afterEach(() => {
      userModelGetUserByEmailStub.restore();
    });

    it("Should return user data when email is found", async () => {
      const stubbedUser = {
        id: "2" as UUID,
        name: "User 2",
        email: "user2@email.com",
        password: "hashedPassword",
        permissions: perms.userPerms,
      };
      userModelGetUserByEmailStub.returns(stubbedUser);

      const res = await getUserByEmail("user1@email.com");

      expect(res).toStrictEqual(stubbedUser);
    });

    it("Should throw an error when email is not found", async () => {
      userModelGetUserByEmailStub.returns(undefined);

      await expect(() => getUserByEmail("notfound@email.com")).rejects.toThrow(
        new Error("User with email notfound@email.com not found")
      );
    });
  });
});
