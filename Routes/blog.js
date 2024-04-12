
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');



// GET route to render the blog form
router.get('/add-Blog', (req, res) => {
    const user = req.user; 
    const errors = {
        title: 'Title is required',
        content: 'Content is required',
    };
 
    return res.render('blog', { user, errors });
});

// POST route to handle form submission
router.post('/',(req,res)=>{
    
    // Log the blog data from the form
    console.log('Submitted Blog Data:', req.body);
    

    // Redirect back to the homepage after form submission
    return res.redirect('/');
});

module.exports = router;
