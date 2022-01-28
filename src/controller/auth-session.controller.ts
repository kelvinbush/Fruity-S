import { Request, Response } from "express";
import config from "config";
import { validatePassword } from "../service/user.service";
import {
  createAuthSession,
  findUserAuthSessions,
  updateSession,
} from "../service/auth-session.service";
import { signJwt } from "../utils/jwt.utils";

export async function createAuthSessionHandler(req: Request, res: Response) {
  const user = await validatePassword(req.body);
  if (!user) return res.status(401).send("Invalid email or password");

  const session = await createAuthSession(user, req.get("user-agent") || "");

  // create an access token
  const accessToken = signJwt(
    { ...user, session: session.id },
    "accessTokenPrivateKey",
    { expiresIn: config.get("accessTokenTtl") } // 15 minutes
  );

  // create refresh token
  const refreshToken = signJwt(
    { ...user, session: session.id },
    "refreshTokenPrivateKey",
    { expiresIn: config.get("refreshTokenTtl") } // 1yr
  );

  return res.send({ accessToken, refreshToken });
}

export async function getUserAuthSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user.id;
  const sessions = await findUserAuthSessions(userId);
  return res.send(sessions);
}

export async function deleteAuthSessionHandler(req: Request, res: Response) {
  const userId = res.locals.user.id;
  try {
    await updateSession(userId);
    return res.send({
      accessToken: null,
      refreshToken: null,
    });
  } catch (e) {
    return res.status(409);
  }
}
