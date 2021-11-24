import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const requireUser = (req: Request, res: Response, next: NextFunction) => {
	const user = res.locals.user;
	logger.info("Require User");
	if (!user) {
		logger.info("Require NO User");
		return res.sendStatus(403);
	}

	return next();
};

export default requireUser;
