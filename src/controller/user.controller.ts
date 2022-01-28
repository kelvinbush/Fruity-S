import { Request, Response } from "express";
import { CreateUserInput } from "../schema/createUserSchema";
import { createUser } from "../service/user.service";
import { UserInput } from "../utils/m-types";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    await createUser(req.body as UserInput);
    return res.send(`${req.body.name} added successfully`);
  } catch (e: any) {
    if (e.message == "1062") {
      return res
        .status(409)
        .send({ message: "Could not add user", error: "Email already exists" });
    }
    return res
      .status(500)
      .send({ message: "Could not add user", error: e.message });
  }
}
