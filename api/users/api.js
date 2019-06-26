const userController = require('./controller')
const express = require('express')
const { paramIsId } = require('../utils/checkId')
const { checkBody, cleanBody, checkFields } = require('../utils/fields')

exports.UserAPI = class {
    constructor() {
        this.checkBody = checkBody
        this.cleanBody = cleanBody.bind(this)
        this.checkFields = checkFields.bind(this)
        this.requiredFields = ['email', 'password']
        this.fields = ['email', 'password']
    }

    get router() {
        let router = express.Router()
        router.use(express.json())

        // GET /
        router.get('/', userController.getAll)
        // GET /:id
        router.get('/:id', paramIsId)
        router.get('/:id', userController.getItem)
        // POST /
        router.post('/', this.checkBody)
        router.post('/', this.checkFields)
        router.post('/', this.cleanBody)
        router.post('/', userController.validate)
        router.post('/', userController.createItem)
        // PUT /:id
        router.put('/:id', paramIsId)
        router.put('/:id', this.checkBody)
        router.put('/:id', this.cleanBody)
        router.put('/:id', userController.validate)
        router.put('/:id', userController.updateItem)
        // DELETE /:id
        router.delete('/:id', paramIsId)
        router.delete('/:id', userController.deleteItem)

        return router
    }

}