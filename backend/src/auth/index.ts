import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/lib/adapters/node/JSONFile';

type User = {
    id: string;
    username: string;
    password: string;
};

type DbSchema = {
    users: User[];
};


const adapter = new JSONFileSync<DbSchema>('db.json');
const db = new LowSync(adapter, { users: [] });

db.read();

if (!db.data) {
    db.data = { users: [] };
    db.write();
}

const authRouter = express.Router();

authRouter.post('/register', (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = db.data.users.find((user) => user.username === username);

    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const newUser: User = {
        id: Date.now().toString(),
        username,
        password,
    };

    db.data.users.push(newUser);
    db.write();
    res.status(201).json(newUser);
});

authRouter.post('/login', (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = db.data.users.find(
        (user) => user.username === username && user.password === password
    );

    if (user) {
        res.status(200).json({ message: 'Login successful', user });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
});

export { authRouter };
