import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

async function seedAdmin() {
    await mongoose.connect(process.env.MONGO_URI);

    try {
        const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (existingAdmin) {
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log(`${process.env.ADMIN_EMAIL} promoted to Admin.`);
            } else {
                console.log(`${process.env.ADMIN_EMAIL} is already an Admin.`);
            }
            process.exit(0);
        }
        
        const hashedPass = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
        await User.create({
            fullname: 'Admin',
            email: process.env.ADMIN_EMAIL,
            contact: 7608587401,
            password: hashedPass,
            role: 'admin',
        });
        process.exit(0);
    } catch (error) {
        console.error('Admin seeding failed', error);
        process.exit(0);
    }
};

seedAdmin();