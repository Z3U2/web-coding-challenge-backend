const mongoose = require('mongoose')
const { pointSchema } = require('../utils/point')

const shopSchema = new mongoose.Schema({
    name: String,
    location: pointSchema,
    picture: String
})

const shopModel = mongoose.model('Shop', shopSchema)

module.exports = shopModel