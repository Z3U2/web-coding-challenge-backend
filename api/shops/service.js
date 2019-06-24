const shopModel = require('./model')

exports.getAll = async (query) => {
    let items = await shopModel.find(query)
    return items
}

exports.getItem = async (query) => {
    let items = await shopModel.findOne(query)
    return items
}

exports.deleteItem = async (query) => {
    return await shopModel.findOneAndRemove(query)
}

exports.updateItem = async (query,item) => {
    return await shopModel.findOneAndUpdate(query,item)
}

exports.createItem = async (item) => {
    let newItem = new shopModel({
        ...item
    })
    return await newItem.save()
}