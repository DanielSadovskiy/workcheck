import express from "express";
import cors from "cors";
import loggerMiddleware from "./middlewares/logger"
import  cookieParser from 'cookie-parser'
import {errorMiddleware} from "./middlewares/errorMiddleware"
import userRouter from './routes/user'
import professorRouter from './routes/professor'
import {config } from "./configs/config"
import mongoServices from './services/mongo'
import { seedDB } from "./models/seed";
import { createServer } from 'http';
import  {Server}  from "socket.io";
import ExpressPeerServer from "peerjs"

const app = express(); 
const socketUtils = require("./utils/socket");
const server = createServer(app);
export const io = socketUtils.sio(server);
socketUtils.connection(io);

var options = {
    debug: true
}

app.use(cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Methods", "Access-Control-Request-Headers"],
    credentials: true,
    preflightContinue: true
}))

app.use(cookieParser())
app.use(loggerMiddleware)
app.use('/user', userRouter)
app.use('/professor',professorRouter)

app.use(errorMiddleware);


const runApp = () => {
    server.listen(config.server.app_port, () => {
    console.log(`Listen on the port ${config.server.app_port}...`);
    });
}

try {
    mongoServices.mongoConnect(() => {
        seedDB()
        runApp()
    })
} catch (e) {
    console.error(e)
}
