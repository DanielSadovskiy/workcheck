import dotenv from 'dotenv';

dotenv.config()

const MONGO_USERNAME = process.env.MONGO_USERNAME
const MONGO_PASSWORD = process.env.MONGO_PASSWORD
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.yw1kwau.mongodb.net/?retryWrites=true&w=majority`
const SECRET_KEY = process.env.SECRET_KEY

const APP_PORT = process.env.APP_PORT ? Number(process.env.APP_PORT) : 3000
const WS_PORT = process.env.APP_PORT ? Number(process.env.WS_PORT) : 3002
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 27017
const DB_NAME = process.env.DB_NAME


export const config = {
    mongo: {
        url: MONGO_URL,
        db_port: DB_PORT,
        db_name: DB_NAME
    },
    server: {
        app_port: APP_PORT,
        ws_port: WS_PORT
    },
    auth: {
        secret: SECRET_KEY
    }
}