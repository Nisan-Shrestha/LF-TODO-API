import { IUser } from "../interfaces/User";
import { UUID } from "crypto";
import path from "path";
import fs from "fs/promises";
import { BadRequest } from "../error/BadRequest";
import { Conflict } from "../error/Conflict";
import { Internal } from "../error/Internal";

const pathToUserData = path.join(__dirname, "../data/users.json");

export async function getUserInfo(id: UUID) {
  try {
    const parsed_data: IUser[] = await readUserData();

    const user = parsed_data.find(({ id: userID }) => userID === id);
    if (user) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    }
    return null;
  } catch (e) {
    if (e instanceof Error) {
      console.log("Error retrieving User info", id);
      throw new Internal(e.message);
    }
  }
}

export async function getAllUser() {
  try {
    const parsed_data: IUser[] = await readUserData();
    if (parsed_data) {
      const users = parsed_data.map((user) => {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      });
      return users;
    }
    return null;
  } catch (e) {
    if (e instanceof Error) {
      console.log("Error retrieving Users infos");
      throw new Error(e.message);
    }
  }
}

export async function createUser(user: IUser) {
  try {
    const parsed_data: IUser[] = await readUserData();
    const userExists = getUserByEmail(user.email);
    console.log("user:", user);
    console.log("user:", user);
    if (userExists) {
      throw new Conflict(`User with email ${user.email} already exists`);
    }
    parsed_data.push(user);
    await writeUserData(parsed_data);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  } catch (e) {
    if (e instanceof Error) {
      console.log("Model -> createUser: ", e.message);
      throw new Error(e.message);
    }
  }
}

export async function updateUser(id: UUID, data: Partial<IUser>) {
  try {
    const parsed_data: IUser[] = await readUserData();
    const userIndex = parsed_data.findIndex(({ id: userID }) => userID === id);
    if (userIndex === -1) {
      return null;
    }

    const updatedUser = { ...parsed_data[userIndex], ...data };
    parsed_data[userIndex] = updatedUser;

    await writeUserData(parsed_data);
    return updatedUser;
  } catch (e) {
    if (e instanceof Error) {
      console.log("Model -> updateUser: ", data);
      throw new Error(e.message);
    }
  }
}
export async function deleteUser(id: UUID) {
  try {
    const parsed_data = await readUserData();
    const filtered_users = parsed_data.filter(
      ({ id: userID }) => userID !== id
    );
    if (parsed_data.length === filtered_users.length) {
      return false;
    }
    await writeUserData(filtered_users);
    return true;
  } catch (e) {
    if (e instanceof Error) {
      console.log("Model -> deleteUser: ", id);
      throw new Error(e.message);
    }
  }
}

export async function getUserByEmail(email: string) {
  try {
    const parsed_data = await readUserData();
    const user = parsed_data.find(
      ({ email: userEmail }) => userEmail === email
    );
    console.log(user);
    return user;
  } catch (e) {
    if (e instanceof Error) {
      console.log("Model -> deleteUser: ", email);
      throw new Error(e.message);
    }
  }
}

async function readUserData(): Promise<IUser[]> {
  try {
    const usersData = await fs.readFile(pathToUserData, "utf-8");
    const parsedData: IUser[] = JSON.parse(usersData);
    return parsedData;
  } catch (error) {
    console.error("UserModel Read Error ", error);
    throw new Error("Error reading user data from file");
  }
}

async function writeUserData(userData: IUser[]): Promise<void> {
  try {
    const data = JSON.stringify(userData);
    await fs.writeFile(pathToUserData, data, "utf8");
  } catch (error) {
    console.error("UserModel Write Error: ", error);
    throw new Error("Error Writing user data to file");
  }
}
