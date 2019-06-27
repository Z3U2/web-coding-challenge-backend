const userService = require('./service')
const { validate } = require('./helper/validate')

exports.getAll = async (req, res, next) => {
    try {
        let items = await userService.getAll({})

        return res.status(200).json({
            status: 200,
            data: items,
            message: `Successfully received users`
        })
    } catch (e) {
        next(e)
    }
}

exports.getItem = async (req, res, next) => {
    let id = req.params.id
    try {
        let item = await userService.getItem({ _id: id })

        if (!item) return res.status(404).json({
            status: 404,
            message: `Item with id : ${id} not found`
        })

        return res.status(200).json({
            status: 200,
            data: item,
            message: `Successfully received user`
        })
    } catch (e) {
        next(e)
    }
}

exports.createItem = async (req, res, next) => {
    let item = {
        email: req.body.email,
        password: req.body.password
    }

    try {
        let savedItem = await userService.createItem(item)

        return res.status(200).json({
            status: 200,
            id: savedItem._id,
            message: `Successfully saved user`
        })
    } catch (e) {
        next(e)
    }
}

exports.deleteItem = async (req, res, next) => {
    let id = req.params.id
    try {
        let deletedItem = await userService.deleteItem({ _id: id })

        if (!deletedItem) return res.status(404).json({
            status: 404,
            message: `Item with id : ${id} not found`
        })

        return res.status(200).json({
            status: 200,
            id: id,
            message: `Successfully deleted user`
        })
    } catch (e) {
        next(e)
    }
}

exports.updateItem = async (req, res, next) => {
    let id = req.params.id
    let user = req.body
    try {
        let updatedItem = await userService.updateItem({ _id: id }, { ...user })

        if (!updatedItem) return res.status(404).json({
            status: 404,
            message: `Item with id : ${id} not found`
        })

        return res.status(200).json({
            status: 200,
            id: id,
            message: `Successfully deleted user`
        })
    } catch (e) {

    }
}

exports.addPref = async (req, res, next) => {
    return res.status(404).json({
        status: 404,
        message: 'Code this endpoint'
    })
}

exports.removePref = async (req, res, next) => {
    return res.status(404).json({
        status: 404,
        message: 'Code this endpoint'
    })
}

exports.getPref = async (req, res, next) => {
    return res.status(404).json({
        status: 404,
        message: 'Code this endpoint'
    })
}

exports.validate = validate