const cookieParser = require('cookie-parser');
const { validateToken } = require('../services/authentication');

function authenticationMiddleware(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];

        if (!tokenCookieValue) {
            console.log('Token not found in cookies');
            return next(); // Move to the next middleware or route handler
        }

        try {
            const userToken = validateToken(tokenCookieValue);
            req.user = userToken;
            console.log('User authenticated:', userToken);
            return next(); // Move to the next middleware or route handler
        } catch (error) {
            console.error('Error validating token:', error);
            // Handle the error
            res.status(401).send('Unauthorized'); //  send a 401 Unauthorized status
        }
    };
}

module.exports = {
    authenticationMiddleware,
};
