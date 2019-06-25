const shopController = require('./controller')
const express = require('express')
const { paramIsId } = require('../utils/checkId')

exports.ShopAPI = class {
    constructor() {

    }

    get router() {
        let router = express.Router()
        router.use(express.json())
        
        // GET /
        router.get('/', shopController.getAll)
        // GET /:id
        router.get('/:id',paramIsId)
        router.get('/:id', shopController.getItem)
        // POST /
        router.post('/', shopController.validate)
        router.post('/', shopController.createItem)
        // PUT /:id
        router.put('/:id', paramIsId)
        router.put('/:id', shopController.updateItem)
        // DELETE /:id
        router.delete('/:id', paramIsId)
        router.delete('/:id', shopController.deleteItem)
        
        return router
    }

}