import * as express from 'express';
import { io } from '../index';
import professorService from "../services/Professor"

const loginHandler = async ( req: express.Request, res:express.Response) => {
    const { name, password } = req.body;
    try {
        const {user, sessionToken, expiresAt} = await professorService.login({name, password})
        const {password: _, _id, ...userDataToSend} = user
        res.cookie("Session", sessionToken, { expires: expiresAt, httpOnly: true })
        res.status(200).send({user: {...userDataToSend, id: _id}});
    } catch(e){
        res.status(e.status || 500).send({message: e.message})
    }
    
};

const getAll = async (req: express.Request, res: express.Response) => {
    const professors = await professorService.getAll()
    res.status(200).send(professors)
}

const changePasswordHandler = async ( req: express.Request, res: express.Response) => {
    const { id, password } = req.body;
    const response = await professorService.changePassword({id, password})
    res.status(201).send(response)
}

const getPolicies = async (req: express.Request, res:express.Response) => {
    console.log(req.query)
    const name = req.query.name as string
    try {
        const {policies} = await professorService.getPolicies({name})
        res.status(200).send({policies});
    } catch(e){
        res.status(e.status || 500).send({message: e.message})
    }
};

const userChangedFocusHandler = (req: express.Request, res: express.Response) => {
    const { name } = req.body;
    console.log(req.body)
    try{
        io.emit("focus", {name})
    } catch(e) {
        console.log(e)
    }
    res.status(200)
}

const changeOldPasswordHandler = async ( req: express.Request, res: express.Response) => {
    try{
        const { id, oldPassword, newPassword } = req.body;
        const response = await professorService.changeOldPassword({id, oldPassword, newPassword})
        res.status(201).send(response)
    } catch(e) {
        res.status(e.status || 500).send({message: e.message})
    }
}

const addNewPolicyHandler =async ( req: express.Request, res: express.Response) => {
    try{
        const { id, policy } = req.body;
        const response = await professorService.addNewPolicy({id, policy})
        res.status(201).send(response)
    } catch(e) {
        res.status(e.status || 500).send({message: e.message})
    }
}

const removePolicyHandler = async ( req: express.Request, res: express.Response) => {
    try{
        const { id, policy } = req.body;
        const response = await professorService.removePolicy({id, policy})
        res.status(201).send(response)
    } catch(e) {
        res.status(e.status || 500).send({message: e.message})
    }
}



module.exports = { loginHandler, getAll, changePasswordHandler, getPolicies, changeOldPasswordHandler, addNewPolicyHandler, removePolicyHandler, userChangedFocusHandler};