const userController = require('./controller')
const express = require('express')
const { paramIsId } = require('../utils/checkId')
const { checkBody, cleanBody, checkFields } = require('../utils/fields')
const { login, authMiddleWare,authRequired,logout } = require('./helper/auth/auth') 
exports.UserAPI = class {
    constructor() {
        this.authMiddleWare = authMiddleWare
        this.authRequired = authRequired
        this.login = login
        this.logout = logout
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
        // GET /logout
        router.get('/logout', this.authMiddleWare)
        router.get('/logout', this.authRequired)
        router.get('/logout', this.logout)
        // GET /me
        router.get('/me', this.authMiddleWare)
        router.get('/me', this.authRequired)
        router.get('/me', userController.getMe)
        // GET /pref
        router.get('/pref', this.authMiddleWare)
        router.get('/pref', this.authRequired)
        router.get('/pref', userController.getPref)
        // GET /:id
        router.get('/:id', paramIsId)
        router.get('/:id', userController.getItem)
        // POST /
        router.post('/', this.checkBody)
        router.post('/', this.checkFields)
        router.post('/', this.cleanBody)
        router.post('/', userController.validate)
        router.post('/', userController.createItem)
        // POST /login
        router.post('/login', this.authMiddleWare)
        router.post('/login', this.login)
        // POST /signup
        router.post('/signup', this.authMiddleWare)
        router.post('/signup', this.checkBody)
        router.post('/signup', this.checkFields)
        router.post('/signup', this.cleanBody)
        router.post('/signup', userController.validate)
        router.post('/signup', userController.checkUniqueEmail)
        router.post('/signup', userController.hashPass)
        router.post('/signup', userController.createItem)
        // POST /pref/:id
        router.post('/pref/:id', this.authMiddleWare)
        router.post('/pref/:id', this.authRequired)
        router.post('/pref/:id', paramIsId)
        router.post('/pref/:id', userController.attachShop)
        router.post('/pref/:id', userController.addPref)
        // PUT /:id
        router.put('/:id', paramIsId)
        router.put('/:id', this.checkBody)
        router.put('/:id', this.cleanBody)
        router.put('/:id', userController.validate)
        router.put('/:id', userController.updateItem)
        // DELETE /pref/:id
        router.delete('/pref/:id', this.authMiddleWare)
        router.delete('/pref/:id', this.authRequired)
        router.delete('/pref/:id', paramIsId)
        router.delete('/pref/:id', userController.attachShop)
        router.delete('/pref/:id', userController.removePref)
        // DELETE /:id
        router.delete('/:id', paramIsId)
        router.delete('/:id', userController.deleteItem)

        return router
    }

}