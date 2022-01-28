import { User } from "../entity/User";
import { getConnection, getRepository } from "typeorm";
import logger from "../utils/logger";
import { UserInput } from "../utils/m-types";

export async function createUser(input: UserInput) {
  const { name, email, password } = input;
  try {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([{ name, email, password }])
      .execute();
  } catch (e) {
    logger.error(e);
  }
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await getPartialUserByEmail(email);
  if (!user) return false;
  const isValid = await user.comparePassword(password);
  if (!isValid) return false;
  return user;
}

export async function getPartialUserByEmail(email: string) {
  try {
    const user = await getRepository(User)
      .createQueryBuilder("user")
      .select(["user.id", "user.name", "user.email"])
      .where("user.email = :email", { email })
      .getOne();
    if (!user) return false;
    return user;
  } catch (e) {
    logger.error(e);
  }
}

export async function getPartialUserByAuthSession(id: string) {
  const user = await getRepository(User)
    .createQueryBuilder("user")
    .select(["user.id", "user.name", "user.email"])
    .innerJoin("user.authSessions", "session")
    .where("session.id = :id", { id })
    .getOne();

  if (!user) return false;
  return user;
}
