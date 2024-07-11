import bcrypt from "bcrypt";
import * as UserModel from "../models/User";
import { UUID } from "crypto";
import { IUser } from "../interfaces/User";
import { hash } from "bcrypt";

import crypto from "crypto";
import { permission } from "process";
import { perms } from "../utils/permission";

export function getUUID() {
  return crypto.randomUUID();
}

export async function getUserInfo(id: UUID) {
  try {
    const data = await UserModel.getUserInfo(id);

    if (!data) {
      throw new Error(`User with ${id} not found`);
    }

    console.log(data);
    return data;
  } catch (e) {
    if (e instanceof Error) {
      console.log("UserService -> getUserInfo", e.message);
      throw new Error(e.message);
    }
  }
}

export async function getAllUser() {
  try {
    const data = await UserModel.getAllUser();

    if (!data) {
      throw new Error("Could not read users");
    }
    return data;
  } catch (e) {
    if (e instanceof Error) {
      console.log("UserService -> getUserInfo", e.message);
      throw new Error(e.message);
    }
  }
}

export async function createuser(user: IUser) {
  try {
    const hashedPassword = await hash(user.password, 10);
    const newUser = {
      id: getUUID(),
      name: user.name,
      email: user.email,
      password: hashedPassword,
      permissions: perms.userPerms,
    };
    return await UserModel.createuser(newUser);
  } catch (e) {
    if (e instanceof Error) {
      console.log("UserService -> createuser: ", e.message);
      throw new Error(e.message);
    }
  }
}

export async function updateUser(id: UUID, data: Partial<IUser>) {
  const { name, email } = data;
  const dataToUpdate: Partial<IUser> = {};
  if (name) dataToUpdate.name = name;
  if (email) dataToUpdate.email = email;

  return await UserModel.updateUser(id, dataToUpdate);
}

export async function deleteUser(id: UUID) {
  try {
    await UserModel.deleteUser(id);
    return {
      message: "User deleted Successfully",
    };
  } catch (e) {
    if (e instanceof Error) {
      console.log("UserService -> deleteUser");
      throw new Error(e.message);
    }
  }
}

export async function getUserByEmail(email: string) {
  const data = await UserModel.getUserByEmail(email);
  if (data) {
    return data;
  }

  throw new Error(`User with ${email} not found`);
}
