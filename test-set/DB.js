const mongoose = require('mongoose')

const shopModel = require('../api/shops/model')
const userModel = require('../api/users/model')

const shops = require('./shops.json')
const users = require('./users.json')

const collections = [shopModel,userModel];

async function initDB() {
    try {
        await shopModel.insertMany(shops)
        await userModel.insertMany(users)    
        return    
    } catch (e) {
        console.log(e)
        throw e;
    }
}

async function cleanDB() {
    try {
        for (col of collections) {
            await col.deleteMany({})
        }
        await mongoose.connection.db.collection('sessions').deleteMany({})
        return
    }
    catch(e) {
        throw e
    }
}


module.exports.initDB = initDB;
module.exports.cleanDB = cleanDB;