import { Internal } from "./../error/Internal";
import bcrypt from "bcrypt";
import * as UserModel from "../models/User";
import { UUID } from "crypto";
import { IUser } from "../interfaces/User";
import { hash } from "bcrypt";
import crypto from "crypto";
import { permission } from "process";
import { perms } from "../utils/permission";
import { NotFound } from "../error/NotFound";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("UserServices");

export async function getUserInfo(id: UUID) {
  logger.info(`Getting user info for id: ${id}`);
  const data = await UserModel.getUserInfo(id);

  if (!data) {
    logger.error(`User with id ${id} not found`);
    throw new NotFound(`User with ${id} not found`);
  }

  logger.info(`User info retrieved: ${JSON.stringify(data)}`);
  return data;
}

export async function getAllUser() {
  logger.info("Getting all users");
  const data = await UserModel.getAllUser();

  if (!data) {
    logger.error("Could not get users");
    throw new Internal("Could not get users");
  }

  logger.info(`Retrieved ${data.length} users`);
  return data;
}

export async function createuser(user: IUser) {
  logger.info(`Creating user: ${JSON.stringify(user)}`);
  const hashedPassword = await hash(user.password, 10);
  const newUser = {
    id: crypto.randomUUID(),
    name: user.name,
    email: user.email,
    password: hashedPassword,
    permissions: perms.userPerms,
  };
  const createdUser = await UserModel.createuser(newUser);
  logger.info(`User created: ${JSON.stringify(createdUser)}`);
  return createdUser;
}

export async function updateUser(id: UUID, data: Partial<IUser>) {
  logger.info(`Updating user with id: ${id}`);
  const { name, email } = data;
  const dataToUpdate: Partial<IUser> = {};
  if (name) dataToUpdate.name = name;
  if (email) dataToUpdate.email = email;
  const updatedUser = await UserModel.updateUser(id, dataToUpdate);
  logger.info(`User updated: ${JSON.stringify(updatedUser)}`);
  return updatedUser;
}

export async function deleteUser(id: UUID) {
  logger.info(`Deleting user with id: ${id}`);
  await UserModel.deleteUser(id);
  logger.info(`User with id ${id} deleted successfully`);
  return {
    message: "User deleted Successfully",
  };
}

export async function getUserByEmail(email: string) {
  logger.info(`Getting user by email: ${email}`);
  const data = await UserModel.getUserByEmail(email);
  if (data) {
    logger.info(`User found: ${JSON.stringify(data)}`);
    return data;
  }

  logger.error(`User with email ${email} not found`);
  throw new Error(`User with ${email} not found`);
}
