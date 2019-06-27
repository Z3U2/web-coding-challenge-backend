const express = require('express')
const { ShopAPI } = require('./shops/api')
const { UserAPI } = require('./users/api')

exports.API = class {
    constructor() {
        this.shopRouter = new ShopAPI().router
        this.userRouter = new UserAPI().router
    }

    get router() {
        let router = express.Router()

        router.use('/users', this.userRouter)
        router.use('/shops', this.shopRouter)

        return router
    }

}