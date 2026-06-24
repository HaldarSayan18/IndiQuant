import 'dotenv/config';
import express, { json } from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import { User } from "../models/User.js";
import { auth } from '../middlewares/auth.js';

const router = express.Router();

// POST - register
router.post('/register', async (req, res) => {
    try {
        const { fullname, email, contact, password } = req.body;
        if (!fullname || !email || !contact || !password)
            return res.status(400).json({ error: 'All  fields are required.' });

        // check user exists or not
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ error: 'Email already registered.' });

        // hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // save new user
        const newUser = await User.create({ role : 'user', fullname, email, contact, password: hashedPassword });

        // sign jwt
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        console.log('Registered');
        res.status(201).json({
            success: true,
            token,
            user: { id: newUser._id, email: newUser.email, contact: newUser.contact, role: newUser.role },
            message: 'New user saved'
        })
    } catch (error) {
        console.log('Registration failed.', error);
        res.status(500).json({ success: false, message: 'Registration failed.', error: error.message })
    }
});

// POST - login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: 'Email & Password required.' });
        const loggedUser = await User.findOne({ email }).select('+password');
        if (!loggedUser)
            return res.status(401).json({ error: 'Invalid email or password' });

        // compare password with stored hash
        const passwordMatch = await bcrypt.compare(password, loggedUser.password);
        if (!passwordMatch)
            return res.status(401).json({ error: 'Recheck password' });

        const token = jwt.sign(
            { id: loggedUser._id, role: loggedUser.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )
        res.status(200).json({
            success: true,
            token,
            user: { id: loggedUser._id, email: loggedUser.email, contact: loggedUser.contact, role: loggedUser.role },
            message: 'Login successful'
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'login failed', error: error.message })
    }
})

// GET - me
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.status(200).json({ id: user._id, fullname: user.fullname, email: user.email, contact: user.contact, role: user.role })
    } catch (error) {
        console.log('auth error --', error);
        return res.status(500).json({ error: error.message });
    }
})

export default router;