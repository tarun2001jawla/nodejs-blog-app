const express = require('express');
const ejs = require('ejs');
const path = require('path');
const cookieParser = require('cookie-parser');
const userRoutes = require('./Routes/user');

const mongoose = require('mongoose');
const { authenticationMiddleware } = require('./middlewares/authMiddleware');
mongoose.connect('mongodb://127.0.0.1:27017/NodeBlog')
    .then(() => {
        console.log("MongoDb Connected Succesfuly");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

const app = express();
const PORT = 8000;

app.set('view engine', 'ejs');
app.set('views', path.resolve('./Views'));

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//middleware for parsing cookies
app.use(cookieParser());

//our middleware
app.use(authenticationMiddleware("token"));


// Routes
app.get('/', (req, res) => {
    res.render('Home',
    {
        user:req.user
    });
});

// User routes
app.use('/user', userRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server started at Port:${PORT}`);
});
