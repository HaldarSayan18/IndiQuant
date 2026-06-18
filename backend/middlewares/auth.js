import 'dotenv/config';
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const auth = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer '))
            return res.status(401).json({ error: 'No token found. Login again' });

        const token = header.split(' ')[1];

        // verify sign and expiry
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // check if user exists in db
        const existsUser = await User.findById(decodedToken.id);
        if (!existsUser)
            return res.status(401).json({ error: 'User no longer exists' });

        // attach user to every request
        req.user = { id: existsUser._id, role: existsUser.role, fullname: existsUser.fullname, email: existsUser.email };
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError')
            return res.status(401).json({ error: 'Seesion expired - login again' });
        res.status(401).json({ error: 'Invalid token.' });
    }
};

// admin - middleware
export const adminOnly = async (req, res, next) => {
    if (req.user?.role !== 'admin')
        return res.status(403).json({ error: 'Access denied. Admin only' });
    next();
};