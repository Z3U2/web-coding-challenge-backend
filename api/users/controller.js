const userService = require('./service')
const { validate } = require('./helper/validate')
const { attachShop } = require('./helper/attachShop')

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
    let user = req.user
    let shop = req.shop
    if (user.prefs.includes(shop._id)) return res.status(400).json({
        status: 400,
        message: 'ObjectId already in prefs'
    })
    try {
        user.prefs.push(shop)
        await user.save()
        return res.status(200).json({
            status: 200,
            message: `Successfully added ${shop.name} to preferences`
        })
    } catch (e) {
        return next(e)
    }
}

exports.removePref = async (req, res, next) => {
    let user = req.user
    let shop = req.shop
    if (!user.prefs.includes(shop._id)) return res.status(400).json({
        status: 400,
        message: 'ObjectId not in prefs'
    })
    try {
        user.prefs.pull(shop)
        await user.save()
        return res.status(200).json({
            status: 200,
            message: `Successfully deleted ${shop.name} from preferences`
        })
    } catch (e) {
        return next(e)
    }
}

exports.getPref = async (req, res, next) => {
    const user = req.user
    if (!user.prefs) return res.status(200).json({
        status:200,
        message: 'Successfully received preferences',
        data: []
    })
    else return res.status(200).json({
        status: 200,
        message: 'Successfully received preferences',
        data: user.prefs
    })
}

exports.validate = validate
exports.attachShop = attachShop