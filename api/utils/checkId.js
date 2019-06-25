const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const isId = function(str) {
    if (ObjectId.isValid(str) && new ObjectId(str) == str) {
        return true
    } else {
        return false
    }
}

module.exports.paramIsId = async (req,res,next) => {
    if (!isId(req.params.id)) {
        return res.status(400).json({
            status : 400,
            message : `${req.params.id} not a valid ObjectId`
        })
    } else {
        next()
    }
}