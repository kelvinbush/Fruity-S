import { ShoppingSession } from "../entity/ShoppingSession";
import { User } from "../entity/User";
import { getRepository } from "typeorm";
import logger from "../utils/logger";
import { Favourite } from "../entity/Favourite";

/*type FirebaseUser = {
  displayName: string | undefined;
  uid: string | undefined;
  photoUrl: string | undefined;
  email: string | undefined;
  phoneNumber: string | undefined;
};

const getFirebaseUser = async (uid: string): Promise<FirebaseUser | null> => {
  try {
    const userRecord = await admin.auth().getUser(uid);
    return {
      email: userRecord.email,
      phoneNumber: userRecord.phoneNumber,
      photoUrl: userRecord.photoURL,
      uid: userRecord.uid,
      displayName: userRecord.displayName,
    };
  } catch (e: any) {
    logger.error("firebase couldn't");
    return null;
  }
};*/



export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await getPartialUserByEmail(email);
  if (!user) return false;
  const isValid = await user.comparePassword(password);
  if (!isValid) return false;
  return user;
}

export async function getPartialUserByEmail(email: string) {
  try {
    const user = await getRepository(User)
      .createQueryBuilder("user")
      .select(["user.id", "user.name", "user.email"])
      .where("user.email = :email", { email })
      .getOne();
    if (!user) return false;
    return user;
  } catch (e) {
    logger.error(e);
  }
}

export async function getPartialUserByAuthSession(id: string) {
  const user = await getRepository(User)
    .createQueryBuilder("user")
    .select(["user.id", "user.name", "user.email"])
    .innerJoin("user.authSessions", "session")
    .where("session.id = :id", { id })
    .getOne();

  if (!user) return false;
  return user;
}
