const { Router } = require('express');
const User = require('../Models/user');
const router = Router();
const bcrypt = require('bcrypt');
const { generateToken } = require('../services/authentication');

// Render login page with optional error message
router.get('/login', (req, res) => {
    try {
        const errorMessage = ''; // Initialize errorMessage variable
        res.render('LogIn', { errorMessage }); // Pass errorMessage to the template
    } catch (error) {
        console.error('Error rendering login page:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Render signup page
router.get('/signup', (req, res) => {
    try {
        res.render('SignUp');
    } catch (error) {
        console.error('Error rendering signup page:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Handle signup form submission
router.post('/signup', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        console.log('Received signup form data:', { fullName, email }); // Log form data for debugging

        // Check if user with the given email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User with this email already exists:', email); // Log existing user email
            return res.status(400).send('User with this email already exists');
        }

        // Create new user
        const newUser = await User.create({
            fullName,
            email,
            password,
        });
        console.log('User created successfully:', newUser); // Log new user data

        return res.redirect('/');
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Handle login form submission
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user with the given email exists
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(401).render('LogIn', { errorMessage: 'Invalid email or password' });
        }

        // Match hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid password for user:', email);
            return res.status(401).render('LogIn', { errorMessage: 'Invalid email or password' });
        }

        // JWT tokens for authentication
        const token = generateToken(user);
        console.log('Token generated:', token);

        // Set the token in the cookie
        res.cookie("token", token);
        console.log("Token is set in cookie");

        res.redirect('/'); // Redirect to home page

    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
