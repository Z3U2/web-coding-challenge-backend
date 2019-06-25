const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    prefs : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    }]
})

const userModel = mongoose.model('User', userSchema)

module.exports = userModel