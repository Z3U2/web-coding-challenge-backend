const mongoose = require('mongoose')
const { pointSchema } = require('../utils/point')

const shopSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true
    },
    location: {
        type : pointSchema,
        required :true
    },
    picture: String
})

const shopModel = mongoose.model('Shop', shopSchema)

module.exports = shopModel