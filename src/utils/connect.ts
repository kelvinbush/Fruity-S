import {createConnection} from "typeorm";
import logger from "./logger";

async function connect() {
    try {
        const connection = await createConnection();
        logger.info("DB connected");
    } catch (e: any) {
        logger.error("Could not connect to db");
        logger.error(e.message);
        process.exit(1);
    }
}

export default connect;
