import { Request, Response } from "express";
import { CreateUserInput } from "../schema/createUserSchema";
import { createUser } from "../service/user.service";
import logger from "../utils/logger";
import { UserInput } from "../utils/m-types";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    await createUser(req.body as UserInput);
    return res.send(`${req.body.name} added successfully`);
  } catch (e: any) {
    logger.error(e);
    return res.status(409).send(e.message);
  }
}
