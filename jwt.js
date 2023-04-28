const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    // Check json web token exists and is verified
    if (token) {
        jwt.verify(token, 'talal_ahmed', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

module.exports = { requireAuth };