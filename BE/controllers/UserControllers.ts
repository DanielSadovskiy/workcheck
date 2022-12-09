import * as express from 'express';
const loginUser = (req: express.Request, res:express.Response) => {
    res.send("Hi there");
};

module.exports = { loginUser };