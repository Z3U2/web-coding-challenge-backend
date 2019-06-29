const shopService = require('../../shops/service')

exports.attachShop = async (req, res, next) => {
    let id = req.params.id
    try {
        let shop = await shopService.getItem({ _id: id })

        if(!shop) return res.status(404).json({
            status:404,
            message: 'No such shop'
        })

        else {
            req.shop = shop
            return next()
        }
    } catch (e) {
        return next(e)
    }
}