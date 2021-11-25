import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import admin from "firebase-admin";
import logger from "../utils/logger";
import config from "config";

const deserializeUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
  	
	const accessToken =
		get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

	if (!accessToken) {
		next();
		return;
	}
	try {
		res.locals.user = await admin.auth().verifyIdToken(accessToken);
    logger.info("deserializeUser");
		return next();
	} catch (err) {
		console.log(err);
	}

	return next();
};

export default deserializeUser;
