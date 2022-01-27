import { Request, Response } from "express";
import config from "config";
import { validatePassword } from "../service/user.service";
import { createAuthSession } from "../service/auth-session.service";
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