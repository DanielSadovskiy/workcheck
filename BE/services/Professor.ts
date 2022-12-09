import {v4} from 'uuid';
import Professor from "../models/Professor/Professor";
import bcrypt from 'bcryptjs'
import { Session, sessions } from "../utils/Session"
import { CustomError } from "../utils/CustomError";

interface ILogin {
    name: string
    password: string
}

const login = async ({ name, password }: ILogin): Promise<any> => {
    if (!name || !password) throw new CustomError(401, "Provide credentials")
    const user = await Professor.findOne({ name }).lean()
    if (!user) {
        throw new CustomError(401, "Professor with provided name not found.");
    }   
    const passwordIsValid = user.passwordIsChanged ? bcrypt.compareSync(
        password,
        user.password
    ) :  password === user.password;

    console.log('passwordIsValid', passwordIsValid)

    if (!passwordIsValid) {
        throw new CustomError(401, "Invalid Password!");
    }
    const sessionToken = v4()

    const now = new Date()
    const expiresAt = new Date(+now + 120 * 60 * 1000)

    const session = new Session(user.name, expiresAt)
    sessions[sessionToken] = session
    console.log("sessionToken", sessionToken)
    return { user, sessionToken, expiresAt }
};

const getAll = async () => {
    const professors = await Professor.find()
    return professors
}

interface IChangePassword {
    id: string
    password: string
}

interface IChangeOldPassword {
    id: string
    oldPassword: string
    newPassword: string
}

const changePassword = async ({id, password}: IChangePassword) => {
    const user = await Professor.findById(id)
    if (!user) {
        throw new CustomError(404, "Professor with provided name not found.");
    }  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword  = await bcrypt.hash(password, salt); 
    try { 
        const response = await Professor.findOneAndUpdate({_id: id} , {password: hashedPassword, passwordIsChanged:true})
        return "Password succesfully updated" 
    } catch (err) {
        return err
    }
}

const changeOldPassword = async ({id, oldPassword, newPassword}: IChangeOldPassword) => {
    const user = await Professor.findById(id)
    if (!user) {
        throw new CustomError(404, "Professor with provided name not found.");
    }  
   
    const passwordIsValid = bcrypt.compareSync(
        oldPassword,
        user.password
    ) 
    if(!passwordIsValid) {
        throw new CustomError(401, "Invalid old password!");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword  = await bcrypt.hash(newPassword, salt); 

    try { 
        const response = await Professor.findOneAndUpdate({_id: id} , {password: hashedPassword})
        return "Password succesfully updated" 
    } catch (err) {
        return err
    }
}

const getPolicies = async ({ name }: {name: string}): Promise<{policies:string[]}> => {
    if (!name) throw new CustomError(401, "Provide proffesor name")
    const user = await Professor.findOne({ name }).lean()
    if (!user) {
        throw new CustomError(401, "Professor with provided name not found.");
    }   
    return { policies: user.policies }
};


interface IAddPolicy {
    id: string
    policy: string
}

const addNewPolicy = async ({id, policy}: IAddPolicy) => {
    const user = await Professor.findById(id)
    if (!user) {
        throw new CustomError(404, "Professor with provided name not found.");
    }  
    if(user.policies.includes(policy)){
        throw new CustomError(404, "Provided policy already exists");
    }

    try { 
        const response = await Professor.findOneAndUpdate({_id: id} , {policies: [...user.policies, policy]})
        return {message: "Policies succesfully updated", policy}
    } catch (err) {
        return err
    }
}

const removePolicy = async ({id, policy}: IAddPolicy) => {
    const user = await Professor.findById(id)
    if (!user) {
        throw new CustomError(404, "Professor with provided name not found.");
    }  
    if(!user.policies.includes(policy)){
        throw new CustomError(404, "There is no provided policy");
    }

    try { 
        const response = await Professor.findOneAndUpdate({_id: id} , {policies: user.policies.filter(plc => plc !== policy)})
        return {message: "Policies succesfully updated", policy}
    } catch (err) {
        return err
    }
}


export default { login , getAll, changePassword, getPolicies, changeOldPassword, addNewPolicy, removePolicy}