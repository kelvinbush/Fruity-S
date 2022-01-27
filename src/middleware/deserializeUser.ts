import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwt.utils";
import logger from "../utils/logger";
import {reIssueAccessToken} from "../service/auth-session.service";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  const refreshToken = get(req, "headers.x-refresh");

  if (!accessToken) {
    next();
    return;
  }

  const { decoded, expired } = verifyJwt(accessToken, "accessTokenPublicKey");
  if (decoded) {
    res.locals.user = decoded;
    logger.info(decoded);
    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });
    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
      const result = verifyJwt(
        newAccessToken as string,
        "accessTokenPublicKey"
      );
      res.locals.user = result.decoded;
      return next();
    }
  }

  return next();
};

export default deserializeUser;
