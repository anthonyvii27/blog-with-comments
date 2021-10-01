import { MongoClient } from 'mongodb';
import { ApplicationEnvironment } from '@settings/index';

const url: string = ApplicationEnvironment.MongoURL || "";
const dbName: string = ApplicationEnvironment.MongoDB || "";

if (!url) {
    throw new Error('Please define the MONGO_URL environment variable inside .env');
}

if (!dbName) {
    throw new Error('Please define the MONGO_DB environment variable inside .env');
}

export async function connectToDatabase() {
    const client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const db = await client.db(dbName);

    return { client, db };
}