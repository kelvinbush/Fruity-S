import { ShoppingSession } from "./../entity/ShoppingSession";
import { User } from "../entity/User";
import { getRepository } from "typeorm";
import admin from "firebase-admin";
import logger from "../utils/logger";
import { UserAddress } from "../entity/UserAddress";
import { Favourite } from "../entity/Favourite";

type FirebaseUser = {
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
		logger.error(e.message);
		return null;
	}
};

export async function findOrCreateUser(input: string): Promise<User | void> {
	const userRepository = getRepository(User);
	try {
		const user = await userRepository.findOne({
			where: { username: input },
		});
		if (user) {
			return user;
		}
		if (!user) {
			const fUser = await getFirebaseUser(input);
			if (fUser) {
				const sessionRepo = getRepository(ShoppingSession);
				const favouriteRepo = getRepository(Favourite);
				const newShopSesion = new ShoppingSession();
				newShopSesion.total = 1;
				const session = await sessionRepo.save(newShopSesion);
				const favourite = new Favourite();
				const newFavourite = await favouriteRepo.save(favourite);
				const newUser = userRepository.create({
					firstName: fUser.displayName,
					username: fUser.uid,
					email: fUser.email,
					imageUrl: fUser.photoUrl,
					shoppingSession: session,
					favourites: newFavourite,
				});

				return await userRepository
					.save(newUser)
					.catch((err) => console.log(err));
			}
		}
	} catch (error:any) {
		logger.error(error.message)
	}
	
}

type Address = {
	postalCode: string;
	city: string;
	addressLine1: string;
	addressLine2: string;
};
export async function updateAddress(username: string, userAddress: Address) {
	const addressRepository = getRepository(UserAddress);
	const userRepository = getRepository(User);
	try {
		const user = await userRepository.findOne({
			where: { username: username },
		});

		if (user) {
			const newAddress = await addressRepository.save(userAddress);
			return await userRepository.update(
				{ username: username },
				{ address: newAddress }
			);
		}
	} catch (e: any) {
		logger.error(e.message);
	}
}