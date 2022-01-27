import { Request, Response } from "express";
import { findOrCreateUser } from "../service/user.service";
import logger from "../utils/logger";
import {CreateUserInput} from "../schema/createUserSchema";

export async function createUserHandler(req:Request<{}, {}, CreateUserInput["body"]>, res:Response){

}
