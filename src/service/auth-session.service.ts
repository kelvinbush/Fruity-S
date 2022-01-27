import { User } from "../entity/User";
import { getRepository } from "typeorm";
import { AuthSession } from "../entity/AuthSession";
import logger from "../utils/logger";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import { get } from "lodash";
import { getPartialUserByAuthSession } from "./user.service";
import config from "config";

export async function createAuthSession(user: User, userAgent: string) {
  try {
    const sessionRepo = getRepository(AuthSession);
    const session = sessionRepo.create({ user: user, userAgent: userAgent });
    await sessionRepo.save(session);
    return session;
  } catch (e: any) {
    logger.error(e.message);
  }
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = verifyJwt(refreshToken, "refreshTokenPublicKey");
  if (!decoded || !get(decoded, "session")) return false;

  const session = await getRepository(AuthSession).findOne({
    id: get(decoded, "session"),
  });

  if (!session || !session.valid) return false;

  const user = await getPartialUserByAuthSession(session.id);
  if (!user) return false;
  return signJwt(
    { ...user, session: session.id },
    "accessTokenPrivateKey",
    { expiresIn: config.get("accessTokenTtl") } // 15 minutes
  );
}