const userModel = require('./model')

exports.getAll = async (query) => {
    let items = await userModel.find(query)
    return items
}

exports.getItem = async (query) => {
    let items = await userModel.findOne(query)
    return items
}

exports.deleteItem = async (query) => {
    return await userModel.findOneAndRemove(query)
}

exports.updateItem = async (query, item) => {
    return await userModel.findOneAndUpdate(query, item)
}

exports.createItem = async (item) => {
    let newItem = new userModel({
        ...item
    })
    return await newItem.save()
}