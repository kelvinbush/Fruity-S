import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import admin from "firebase-admin";


const deserializeUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
  	
	const accessToken =
		get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

	if (!accessToken) {
		res.header("Access-Control-Allow-Origin", "*");
		next();
		return;
	}
	try {
		res.header("Access-Control-Allow-Origin", "*");
		res.locals.user = await admin.auth().verifyIdToken(accessToken);
		return next();
	} catch (err) {
		console.log(err);
	}
	res.header("Access-Control-Allow-Origin", "*");

	return next();
};

export default deserializeUser;
