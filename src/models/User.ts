import { UUID } from "crypto";
import path from "path";
import fs from "fs/promises";
import { BadRequest } from "../error/BadRequest";
import { Conflict } from "../error/Conflict";
import { Internal } from "../error/Internal";
import { BaseModel } from "./base";
import { GetUserQuery, IUser } from "../interfaces/User";
import { Response } from "express";

const pathToUserData = path.join(__dirname, "../data/users.json");

export class UserModel extends BaseModel {
  static count(filter: GetUserQuery) {
    const { q } = filter;

    const query = this.queryBuilder().count("*").table("users").first();

    if (q) {
      query.whereLike("name", `%${q}%`);
    }

    return query;
  }

  static getAllUser(filter: GetUserQuery) {
    const { q } = filter;
    const query = this.queryBuilder()
      .select("id", "name", "email")
      .table("users")
      .limit(filter.size)
      .offset((filter.page - 1) * filter.size);

    if (q) {
      query.whereLike("name", `%${q}%`);
    }

    return query;
  }

  static getUserInfo(id: UUID) {
    const query = this.queryBuilder()
      .select("id", "name", "email")
      .table("users")
      .first()
      .where("id", id);

    return query;
  }

  static getUserByEmail(email: string) {
    const user = this.queryBuilder()
      .select("*")
      .table("users")
      .where("email", email)
      .first();
    return user;
  }

  static async create(user: IUser, reqUser: IUser) {
    const userExists = UserModel.getUserByEmail(user.email);
    if (userExists) {
      throw new Conflict(`User with email ${user.email} already exists`);
    }
    const userToCreate = {
      ...user,
      createdAt: new Date(),
      createdBy: reqUser.id,
    };
    await this.queryBuilder().insert(userToCreate).table("users");
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  static async update(id: string, data: Partial<IUser>) {
    let userToUpdate = await this.queryBuilder()
      .select("*")
      .table("users")
      .first()
      .where("id", id);
    if (!userToUpdate) {
      throw new BadRequest(`User with id ${id} not found`);
    }

    userToUpdate = { ...userToUpdate, ...data, updatedAt: new Date() };

    const query = this.queryBuilder()
      .update(userToUpdate)
      .table("users")
      .where({ id });

    await query;
    return userToUpdate;
  }

  static async deleteUser(id: UUID) {
    let userToDelete = await this.queryBuilder()
      .select("*")
      .table("users")
      .first()
      .where("id", id);
    if (!userToDelete) return false;
    let Response = await this.queryBuilder()
      .delete()
      .table("users")
      .where({ id });

    return !!Response;
  }
}
