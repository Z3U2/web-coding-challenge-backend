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

exports.getNearMe = async (lat,lng,prefs) => {
    let geometry = {
        type : 'Point',
        coordinates : [
            lng,
            lat
        ]
    }

    let items = await shopModel.aggregate([
        {
            $geoNear: {
                near: geometry,
                distanceField: 'dist',
                spherical: true,
                query: {
                    _id : {
                        $nin : prefs
                    }
                }
            }
        }
    ])

    return items
}