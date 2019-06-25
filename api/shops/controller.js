const shopService = require('./service')
const { validate } = require('./validate')

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

exports.validate = validate