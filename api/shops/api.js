const shopController = require('./controller')
const express = require('express')
const { paramIsId } = require('../utils/checkId')
const { checkBody, cleanBody, checkFields } = require('../utils/fields')

exports.ShopAPI = class {
    constructor() {
        this.checkBody = checkBody
        this.cleanBody = cleanBody.bind(this)
        this.checkFields = checkFields.bind(this)
        this.requiredFields = ['location', 'name']
        this.fields = ['location', 'name', 'picture']
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
        router.post('/', this.checkBody)
        router.post('/', this.checkFields)
        router.post('/', this.cleanBody)
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