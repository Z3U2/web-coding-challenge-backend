exports.validate = async (req, res, next) => {
    
    if(req.body.email) {
        let email = req.body.email
        if (typeof email !== 'string') return res.status(400).json({
            status: 400,
            message: 'Email should be of type String'
        })
        const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        if(!re.test(email)) return res.status(400).json({
            status: 400,
            message: 'Not a valid email'
        })
    }

    if(req.body.password) {
        let password = req.body.password
        if (typeof password !== 'string') return res.status(400).json({
            status:400,
            message: 'Password should be of type String'
        })
        const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
        if (!re.test(password)) return res.status(400).json({
            status: 400,
            message: 'Password should be between 8 to 15 characters and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character'
        })
    }
    
    return next()
}