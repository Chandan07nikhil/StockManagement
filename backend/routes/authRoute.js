import express from 'express';
import { registerUser, loginUser, refreshAccessToken } from '../services/authService.js';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        await registerUser(name, email, password, false);

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/user/:id', protect, async (req, res) => {
    try {
        if (req.user._id.toString() !== req.params.id && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to access this user' });
        }

        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        
        res.status(500).json({ message: error.message });
    }
});



router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const tokens = await loginUser(email, password);
        res.json(tokens);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});


router.post('/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

        const newAccessToken = refreshAccessToken(refreshToken);
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
});

export default router;
