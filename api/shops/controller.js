const shopService = require('./service')

exports.getAll = async (req, res, next) => {
    try {
        let items = await shopService.getAll({})

        return res.status(200).json({
            status: 200,
            data: items,
            message: `Successfully received shops`
        })
    } catch (e) {
        next(e)
    }
}

exports.getItem = async (req, res, next) => {
    let id = req.params.id
    try {
        let item = await shopService.getItem({ _id: id })

        if (!item) return res.status(404).json({
            status: 404,
            message: `Item with id : ${id} not found`
        })

        return res.status(200).json({
            status: 200,
            data: item,
            message: `Successfully received shop`
        })
    } catch (e) {
        next(e)
    }
}

exports.getItemByName = async (req, res, next) => {
    let name = req.query.name
    let item = await shopService.getItem({ name: name })

    return res.status(200).json({
        status: 200,
        data: item,
        message: `Successfully received shop`
    })
}

exports.createItem = async(req, res, next) => {
    let item = {
        name : req.body.name,
        location : req.body.location
    }

    if (req.body.picture) item.picture = req.body.picture

    try {
        let savedItem = await shopService.createItem(item)

        return res.status(200).json({
            status: 200,
            id: savedItem._id,
            message: `Successfully saved shop`
        })
    } catch (e) {
        next(e)
    }
}

exports.deleteItem = async(req,res,next) => {
    let id = req.params.id
    try {
        let deletedItem = await shopService.deleteItem({ _id: id })

        if(!deletedItem) return res.status(404).json({
            status: 404,
            message: `Item with id : ${id} not found`
        })

        return res.status(200).json({
            status: 200,
            id: id,
            message: `Successfully deleted shop`
        })
    } catch (e)  {
        next(e)
    }
}

exports.updateItem = async (req, res, next) => {
    let id = req.params.id
    let shop = req.body
    try {
        let updatedItem = await shopService.updateItem({ _id: id }, { ...shop })

        if (!updatedItem) return res.status(404).json({
            status: 404,
            message: `Item with id : ${id} not found`
        })

        return res.status(200).json({
            status: 200,
            id: id,
            message: `Successfully deleted shop`
        })
    } catch (e) {

    }
}

exports.validate = async (req, res, next) => {
    if (req.body.location) {
        let location = {}
        // Location type validation
        if(req.body.location.type) {
            let type = req.body.location.type
            if (typeof type !== "string") return res.status(400).json({
                status: 400,
                message: 'Location type should be of type String'
            })
            if (type !== 'Point') return res.status(400).json({
                status: 400,
                message: 'Shop location type should be "Point"'
            })
            location.type = type
        } else return res.status(400).json({
            status : 400,
            message : 'Missing location type'
        })
        // Location coordinates validation
        if(req.body.location.coordinates) {
            let coordinates = req.body.location.coordinates
            if (!Array.isArray(coordinates)) return res.status(400).json({
                status : 400,
                message : 'location.coordinates should be of type "Array"'
            })
            if (coordinates.length !== 2) return res.status(400).json({
                status: 400,
                message : 'location.coordinates should be of length 2 : [lng,lat]'
            })
            let lng = coordinates[0]
            let lat = coordinates[1]
            if (typeof lng !== "number" || typeof lat !== "number") return res
                .status(400).json({
                    status: 400,
                    message: 'location.coordinates should be an array of numbers'
                })
            if (lng > 180 || lng < -180) return res.status(400).json({
                status: 400,
                message: 'not a valid longitude value. ' +
                'Valid longitude values are between -180 and 180, both inclusive.'
            })
            if (lat > 90 || lat < -90) return res.status(400).json({
                status: 400,
                message: 'not a valid latitude value. ' +
                    'Valid latitude values are between -90 and 90, both inclusive.'
            })
            location.coordinates = coordinates
        } else return res.status(400).json({
            status: 400,
            message: 'Missing location coordinates'
        })
        req.body.location = location
    }

    if (req.body.name) {
        let name = req.body.name
        if (typeof name !== "string") return res.status(400).json({
            status: 400,
            message: 'name should be of type "String"'
        })
    }

    next()
}