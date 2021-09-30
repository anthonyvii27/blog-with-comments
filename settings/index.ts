import * as dotenv from 'dotenv';

dotenv.config();

export abstract class ApplicationEnvironment {
    public static MongoURL: string = process.env.MONGO_URL || "";
    public static MongoDB: string = process.env.MONGO_DB || "";
}