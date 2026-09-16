const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// ==========================================
// 1. SIGNUP ROUTE (Create a new user)
// ==========================================
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if both fields are provided
    if (!username || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already taken' });
    }

    // Create and save the new user (password hashing happens automatically in User.js!)
    const newUser = new User({ email, password });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully! You can now log in.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// ==========================================
// 2. LOGIN ROUTE (Authenticate and get a token)
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if the password is correct (using the helper method we made in User.js)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // If login is successful, create a JWT (JSON Web Token)
    // We store the user's ID inside the token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' } // Token expires in 24 hours
    );

    // Send the token back to the frontend
    res.json({ 
      message: 'Logged in successfully',
      token: token,
      email: user.email
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;
