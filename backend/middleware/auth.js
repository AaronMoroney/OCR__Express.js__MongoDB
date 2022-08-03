const jwt =  require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_VERY_LONG_VERY_CRYPTIC_TOKEN');
        const userId = decodedToken.userId; //extract user id
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            errorMsg: 'invalid request!'
        });
    }
};