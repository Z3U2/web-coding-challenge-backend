const userService = require('../service')
exports.checkUniqueEmail = async (req, res, next) => {
    try {
        let email = req.body.email
        let user = await userService.getItem({ email })
        if (user) return res.status(400).json({
            status: 400,
            message: 'User with this email already exists'
        })
        return next()
    } catch (e) {
        return next(e)
    }
    
}