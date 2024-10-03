const jwt = require('jsonwebtoken');

const AuthenticateToken = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"

    if (!token) {
        return res.status(202).json({ error: true, message: 'Access token is missing' });
    }

    // Verify the token
    jwt.verify(token, process.env.SECRET_CODE, (err, user) => {
        if (err) {
            return res.status(202).json({ error: true, message: 'Invalid access token' });
        }

        // Attach the user to the request object
        req.user = user;
        next(); // Call the next middleware or route handler
    });
};

module.exports = AuthenticateToken;
