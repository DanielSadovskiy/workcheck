import mongoose from "mongoose"
import {config } from "../configs/config"


const mongoConnect = (cb : () => void) => {
    mongoose.connect(config.mongo.url, {dbName: config.mongo.db_name})
        .then((res) => {
            console.log('Connected to DB');
            cb()
        })
        .catch((e) => console.error(e))
}


export default {mongoConnect}