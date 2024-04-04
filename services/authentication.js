const JWT = require('jsonwebtoken');
const ms = require('ms');

const JWT_SECRET_KEY = "@I/45R&*OnMa^&)()UY&)*"; // Secret key for JWT

// Function to generate JWT token
function generateToken(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profilePic: user.profilePic,
        role: user.role,
    };

    try {
        const token = JWT.sign(payload, JWT_SECRET_KEY, {
            expiresIn: ms('1h'),
        });
        return token;
    } catch (error) {
        console.error("Error generating token:", error);
        throw new Error("Token generation failed");
    }
}

// Function to validate JWT token
function validateToken(token) {
    if (!token) return null;
    try {
        const decodedToken = JWT.verify(token, JWT_SECRET_KEY);
        return decodedToken;
    } catch (error) {
        console.error("Error verifying token:", error);
        throw new Error("Invalid token");
    }
}

module.exports = {
    generateToken,
    validateToken,
};
