const shopController = require('./controller')
const express = require('express')

exports = class {
    constructor() {

    }

    get router() {
        let router = express.Router()
        router.use(express.json())
        
        // GET /
        router.get('/', shopController.getAll)
        // GET /:shopid
        router.get('/:shopid', shopController.getItem)
        // POST /
        router.post('/', shopController.createItem)
        // PUT /:shopid
        router.put('/:shopid', shopController.updateItem)
        // DELETE /:shopid
        router.delete('/:shopid', shopController.deleteItem)
        
        return router
    }

}