// middleware/adminMiddleware.js
exports.isAdmin = (req, res, next) => {
    // This middleware should run AFTER the 'protect' middleware
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ msg: 'Not authorized as an admin' });
    }
};