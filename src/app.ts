import * as dotenv from "dotenv";
import admin from "firebase-admin";
import express from "express";
dotenv.config({ path: __dirname + "/.env" });
import config from "config";
import cors from "cors";
import logger from "./utils/logger";
import connect from "./utils/connect";
import deserializeUser from "./middleware/deserializeUser";
import cookieParser from "cookie-parser";
import routes from "./routes";

// @ts-ignore
let private_key = "";
if (process.env.FIREBASE_PRIVATE_KEY !== undefined) {
	private_key = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
}

admin.initializeApp({
	credential: admin.credential.cert({
		// @ts-ignore
		type: process.env.FIREBASE_TYPE,
		project_id: process.env.FIREBASE_PROJECT_ID,
		private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
		// @ts-ignore
		private_key: private_key,
		client_email: process.env.FIREBASE_CLIENT_EMAIL,
		client_id: process.env.FIREBASE_CLIENT_ID,
		auth_uri: process.env.FIREBASE_AUTH_URI,
		token_uri: process.env.FIREBASE_TOKEN_URI,
		auth_provider_x509_cert_url:
			process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
		client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
	}),
});

const port = process.env.PORT || config.get<number>("port");

const app = express();

app.use(
	cors({
		origin: config.get<string>("origin"),
		credentials: true,
	})
);

app.use(cookieParser());

app.use(express.json());

app.use(deserializeUser);

app.listen(port, async () => {
	logger.info(`App is running at http://localhost:${port}`);
	routes(app);
	await connect();
});
