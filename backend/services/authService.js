import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const generateTokens = (userId, isAdmin) => {
    const accessToken = jwt.sign({ id: userId, isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ id: userId, isAdmin }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
    return { accessToken, refreshToken };
};


export const registerUser = async (name, email, password, isAdmin) => {
    const userExists = await User.findOne({ email });
    if (userExists) throw new Error('User already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ username: name, email, password: hashedPassword, isAdmin });
};


export const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    return generateTokens(user._id, user.isAdmin);
};


export const refreshAccessToken = (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        return jwt.sign({ id: decoded.id, isAdmin: decoded.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
};
