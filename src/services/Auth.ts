import { sign } from "jsonwebtoken";
import config from "../config";
import { BadRequest } from "../error/BadRequest";
import { Internal } from "../error/Internal";
import { NotFound } from "../error/NotFound";
import { Unauthorized } from "../error/Unauthorized";
import { IUser } from "../interfaces/User";
import { getUserByEmail } from "./User"; //user.services.ts
import bcryptjs from "bcryptjs";
import loggerWithNameSpace from "../utils/logger";
// import sign from "jsonwebtoken";

const logger = loggerWithNameSpace("atuh services");
export async function login(data: Pick<IUser, "email" | "password">) {
  const existingUser = await getUserByEmail(data.email);
  
  // throw new Unauthorized("Invalid password received");
  if (!existingUser) {
    throw new NotFound("User does not exist with given email");
  }
  const isValidPassword = await bcryptjs.compare(
    data.password,
    existingUser.password
  );
  
  logger.info("comparing")
  if (!isValidPassword) {
    logger.error("Invalid password received")
    throw new Unauthorized("Invalid password received");
  }
  logger.info("compared found")

  const payload = {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    permissions: existingUser.permissions,
  };

  if (!config.jwt.secret) {
    throw new Internal("Secret not Setup.");
  }

  const accessToken = sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessTokenExpiryMS,
  });

  const refreshToken = sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.refreshTokenExpiryMS,
  });
  return {
    accessToken,
    refreshToken,
  };
}
