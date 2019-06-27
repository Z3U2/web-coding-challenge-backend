const dotenv = require('dotenv')
dotenv.config({ path: __dirname + '/test.env' })
const express = require('express');
const app = express();
const request = require('supertest');
const mongoose = require('mongoose');
const { initDB, cleanDB } = require('../../test-set/DB')
const { UserAPI } = require('./api')
const { extractCookies } = require('../../test-set/utils')
const { authRequired } = require('./helper/auth/auth')

beforeAll(async () => {
    try {
        await mongoose.connect(
            process.env.DB_URL,
            {
                useNewUrlParser: true,
                useFindAndModify: false
            })
        const userAPI = new UserAPI()
        await cleanDB()
        app.get('/testLogin', authRequired)
        app.get('/testLogin', (req, res, next) => {
            return res.status(200).send("ok")
        } )
        app.use('/', userAPI.router)
        return
    }
    catch (e) {
        throw e
    }
});

describe('POST /login tests', () => {
    beforeAll(async () => {
        await initDB()
        return
    })
    afterAll(async () => {
        await cleanDB()
        return
    })
    test('POST /login with correct inputs', async () => {
        let res = await request(app)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send({
                email: "test1@example.com",
                password: "Hello"
            })
        expect(res.status).toEqual(200)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toEqual('Successfully logged in')
        expect(res.header).toHaveProperty('set-cookie')
        const cookies = extractCookies(res)
        expect(cookies[0][0].key).toEqual('connect.sid')
    })

    test('POST /login with incorrect inputs', async () => {
        let res = await request(app)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send({
                email: "test1@example.com",
                password: "WrongPass"
            })
        expect(res.status).toEqual(400)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toEqual('Incorrect email or password')
    })
    
})