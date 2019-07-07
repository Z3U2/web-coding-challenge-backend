const bcrypt = require('bcrypt')
const saltRounds = 10

exports.hashPass = async (req, res, next) => {
    let password = req.body.password
    try {
        let hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, function (err, hash) {
                if (err) {
                    reject(err)
                }
                resolve(hash)
            })
        })
        req.body.password = hashedPassword
        return next()
    } catch(e) {
        return next(e)
    }
}