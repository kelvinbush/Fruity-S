import {createConnection} from "typeorm";
import logger from "./logger";

async function connect() {
    try {
        await createConnection();
        logger.info("DB connected");
    } catch (e: any) {
        logger.error("Could not connect to db");
        logger.error(e);
        process.exit(1);
    }
}

export default connect;
