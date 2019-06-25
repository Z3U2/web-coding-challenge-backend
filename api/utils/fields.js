function checkBody(req, res, next) {
    if (!req.body) {
        return res.status(400).json({
            status: 400,
            message: 'No request body'
        });
    }
    next();
}

function checkFields(req, res, next) {
    for (let field of this.requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({
                status: 400,
                message: `Missing ${field}`
            });
        }
    }
    next();
}

function cleanBody(req, res, next) {
    let obj = {};
    for (field of this.fields) {
        if (req.body[field]) {
            obj[field] = req.body[field];
        }
    }
    req.body = obj
    next()
}

module.exports.cleanBody = cleanBody
module.exports.checkBody = checkBody
module.exports.checkFields = checkFields