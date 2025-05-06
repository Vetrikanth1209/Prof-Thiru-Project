require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

// Login User and generate JWT token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Compare the entered password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create a JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                full_name: user.full_name || '' ,
                admin :user.admin // Optional chaining in case full_name is not defined
            },
            process.env.JWT_SECRET,
            { expiresIn: '10h' }
        );

        // Return the JWT token and user information
        res.status(200).json({
            msg: 'Login successful',
            token,
            user: {
                user_id: user._id,
                email: user.email,
                full_name: user.full_name || '',
                admin: user.admin // Optional chaining in case full_name is not defined
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

router.post('/register', async (req, res) => {
    const { full_name, email, password, admin } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            full_name,
            email,
            password: hashedPassword,
            admin: admin || false
        });

        await newUser.save();

        res.status(201).json({ msg: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});


module.exports = router;
