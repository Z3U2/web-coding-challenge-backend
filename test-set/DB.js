const shopModel = require('../api/shops/model')

const shops = require('./shops.json')

const collections = [shopModel];

async function initDB() {
    try {
        await shopModel.insertMany(shops)    
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
        return
    }
    catch(e) {
        throw e
    }
}


module.exports.initDB = initDB;
module.exports.cleanDB = cleanDB;