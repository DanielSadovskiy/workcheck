import mongoose, { Document, Schema } from "mongoose"

export interface IProfessor {
    name: string;
    password: string
    passwordIsChanged: boolean;
    policies: string[]
}

export interface IProfessorModel extends IProfessor, Document { }

const ProfessorScheme = new Schema(
    {
        name: { type: String, required: true },
        password: { type: String, required: true},
        passwordIsChanged: { type: Boolean, required: true, default: false},
        policies: {type: [String], required: true, default: []}
    },
    {
        versionKey: false
    }
)


export default mongoose.model<IProfessorModel>("Professor", ProfessorScheme)