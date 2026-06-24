import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    role: { type: String, enum: ['user', 'admin'] },
    fullname: { type: String, required: [true, 'Name is required'] },
    email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true },
    contact: { type: Number, required: [true, 'Mobile nuber is required'] },
    password: { type: String, required: [true, 'Password is required'], minlength: 8, unique: false, select: false },
});

export const User = mongoose.model('users', userSchema);