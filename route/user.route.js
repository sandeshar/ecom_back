import { Router } from "express";

const UserRouter = Router();

UserRouter.get('/', (req, res) => {
    res.send('List of users');
});

UserRouter.post('/', (req, res) => {
    res.send('Create a new user');
});

export default UserRouter;
