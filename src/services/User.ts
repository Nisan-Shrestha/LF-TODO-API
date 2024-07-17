import { hash } from "bcryptjs";
import crypto, { UUID } from "crypto";
import { NotFound } from "../error/NotFound";
import { GetUserQuery, IUser } from "../interfaces/User";
import * as UserModel from "../models/User";
import loggerWithNameSpace from "../utils/logger";
import { perms } from "../utils/permission";
import { Internal } from "./../error/Internal";
// import { UserModel } from "../models/User";

const logger = loggerWithNameSpace("UserServices");

export async function getUserInfo(id: UUID) {
  logger.info(`Getting user info for id: ${id}`);
  const data = await UserModel.UserModel.getUserInfo(id);

  if (!data) {
    logger.error(`User with id: ${id} not found`);
    throw new NotFound(`User with id: ${id} not found`);
  }

  logger.info(`User info retrieved: ${JSON.stringify(data)}`);
  return data;
}

export async function getAllUser(filter: GetUserQuery) {
  logger.info("Getting all users");
  const data = await UserModel.UserModel.getAllUser(filter);

  if (!data) {
    logger.error("Could not get users");
    throw new Internal("Could not get users");
  }
  const count = await UserModel.UserModel.count(filter);

  const meta = {
    page: filter.page,
    size: data.length,
    total: +count.count,
  };

  logger.info(`Retrieved ${data.length} users of total ${count}`);
  // return data;
  return { data, meta };
}

export async function createUser(user: IUser, reqUser: IUser) {
  logger.info(`Creating user: ${JSON.stringify(user)}`);
  const hashedPassword = await hash(user.password, 10);
  const newUser = {
    id: crypto.randomUUID(),
    name: user.name,
    email: user.email,
    password: hashedPassword,
    permissions: perms.userPerms,
  };
  const createdUser = await UserModel.UserModel.create(newUser, reqUser);
  logger.info(`User created: ${JSON.stringify(createdUser)}`);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export async function updateUser(id: UUID, data: Partial<IUser>) {
  logger.info(`Updating user with id: ${id}`);
  const { name, email } = data;
  const dataToUpdate: Partial<IUser> = {};
  if (name) dataToUpdate.name = name;
  if (email) dataToUpdate.email = email;
  const updatedUser = await UserModel.UserModel.update(id, dataToUpdate);
  if (!updatedUser) {
    logger.error(`User with id: ${id} not found`);
    throw new NotFound(`User with id: ${id} not found`);
  }
  logger.info(`User updated: ${JSON.stringify(updatedUser)}`);
  return updatedUser;
}

export async function deleteUser(id: UUID) {
  logger.info(`Deleting user with id: ${id}`);
  let result = await UserModel.UserModel.deleteUser(id);
  if (!result) {
    throw new NotFound(`User with id: ${id} not found`);
  }
  logger.info(`User with id: ${id} deleted successfully`);
  return {
    message: "User deleted Successfully",
  };
}

export async function getUserByEmail(email: string) {
  logger.info(`Getting user by email: ${email}`);
  const data = await UserModel.UserModel.getUserByEmail(email);
  if (data) {
    logger.info(`User found: ${JSON.stringify(data)}`);
    return data;
  }

  logger.error(`User with email ${email} not found`);
  throw new Error(`User with email ${email} not found`);
}
