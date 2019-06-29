const dotenv = require('dotenv')
dotenv.config({ path: __dirname + '/test.env' })
const express = require('express');
const app = express();
const request = require('supertest');
const mongoose = require('mongoose');
const { initDB, cleanDB } = require('../../test-set/DB')
const { UserAPI } = require('./api')
const { extractCookies, getLoginCookies } = require('../../test-set/utils')
const { authRequired, authMiddleWare } = require('./helper/auth/auth')

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
        app.get('/testLogin', authMiddleWare)
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

describe('Session tests', () => {
    let loginCookies
    beforeAll(async () => {
        await initDB()
        loginCookies = await getLoginCookies()
        return
    })
    afterAll(async () => {
        await cleanDB()
        return
    })
    test('Logged in user can access protected routes', async () => {
        let res = await request(app)
            .get('/testLogin')
            .set('cookie', loginCookies)
        expect(res.status).toEqual(200)
    })
    test('Non logged in user can\'t access protected routes', async () => {
        let res = await request(app)
            .get('/testLogin')
        expect(res.status).toEqual(401)
    })
})

describe('/pref tests', () => {
    let loginCookies
    describe('GET /pref tests', () => {
        beforeAll(async () => {
            await initDB()
            loginCookies = await getLoginCookies()
            return
        })
        afterAll(async () => {
            await cleanDB()
            return
        })
        test('GET /pref', async () => {
            let res = await request(app)
                .get('/pref')
                .set('cookie', loginCookies)
            expect(res.status).toEqual(200)
            expect(res.body).toHaveProperty('data')
            expect(res.body.data).toEqual(
                [
                    "5d116e5e97114213e069dd37",
                    "5d116e5e97114213e069dd35"
                ]
            )
        })
    })
    describe('POST /pref/:id tests', () => {
        beforeAll(async () => {
            await initDB()
            loginCookies = await getLoginCookies()
            return
        })
        afterAll(async () => {
            await cleanDB()
            return
        })
        test('POST /pref/:id with valid id', async () => {
            let res = await request(app)
                .post('/pref/5d116e5e97114213e069dd41')
                .set('cookie', loginCookies)
            expect(res.status).toEqual(200)
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toEqual('Succesfully added Ryadsquare store to preferences')
            let verif = await request(app)
                .get('/pref')
                .set('cookie', loginCookies)
            expect(verif.body.data.length).toEqual(3)
            expect(verif.body.data).toContain('5d116e5e97114213e069dd41')
        })
        test('POST /pref/:id with inexistent id', async () => {
            let someId = new mongoose.Types.ObjectId
            let res = await request(app)
                .post(`/pref/${someId}`)
                .set('cookie', loginCookies)
            expect(res.status).toEqual(404)
            let verif = await request(app)
                .get('/pref')
                .set('cookie', loginCookies)
            expect(verif.body.data).not.toContain(`${someId}`)
            expect(verif.body.data.length).toEqual(3)
        })
        test('POST /pref/:id with non valid id', async () => {
            let res = await request(app)
                .post('/pref/something')
                .set('cookie', loginCookies)
            expect(res.status).toEqual(400)
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toEqual('something not a valid ObjectId')
            let verif = await request(app)
                .get('/pref')
                .set('cookie', loginCookies)
            expect(verif.body.data).not.toContain('something')
            expect(verif.body.data.length).toEqual(3)
        })
        test('POST /pref/:id with id already in prefs', async () => {
            let res = await request(app)
                .post('/pref/5d116e5e97114213e069dd37')
                .set('cookie', loginCookies)
            expect(res.status).toEqual(400)
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toEqual('ObjectId already in prefs')
            let verif = await request(app)
                .get('/pref')
                .set('cookie', loginCookies)
            expect(verif.body.data).toEqual([...new Set(verif.body.data)])
            expect(verif.body.data.length).toEqual(3)
        })
    })
    describe('DELETE /pref/:id tests', () => {
        beforeAll(async () => {
            await initDB()
            loginCookies = await getLoginCookies()
            return
        })
        afterAll(async () => {
            await cleanDB()
            return
        })
        test('DELETE /pref/:id with valid id', async () => {
            let res = await request(app)
                .delete('/pref/5d116e5e97114213e069dd37')
                .set('cookie', loginCookies)
            expect(res.status).toEqual(200)
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toEqual('Succesfully deleted Yves Rocher from preferences')
            let verif = await request(app)
                .get('/pref')
                .set('cookie', loginCookies)
            expect(verif.body.data.length).toEqual(1)
            expect(verif.body.data).not.toContain('5d116e5e97114213e069dd37')
            expect(verif.body.data).toEqual(['5d116e5e97114213e069dd35'])
        })
        test('DELETE /pref/:id with inexistent id', async () => {
            let someId = new mongoose.Types.ObjectId
            let res = await request(app)
                .delete(`/pref/${someId}`)
                .set('cookie', loginCookies)
            expect(res.status).toEqual(404)
            let verif = await request(app)
                .get('/pref')
                .set('cookie', loginCookies)
            expect(verif.body.data).toEqual(['5d116e5e97114213e069dd35'])
        })
        test('DELETE /pref/:id with non valid id', async () => {
            let res = await request(app)
                .delete('/pref/something')
                .set('cookie', loginCookies)
            expect(res.status).toEqual(400)
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toEqual('something not a valid ObjectId')
            let verif = await request(app)
                .get('/pref')
                .set('cookie', loginCookies)
            expect(verif.body.data).toEqual(['5d116e5e97114213e069dd35'])
        })
        test('DELETE /pref/:id with id not in prefs', async () => {
            let res = await request(app)
                .delete('/pref/5d116e5e97114213e069dd41')    
                .set('cookie', loginCookies)
            expect(res.status).toEqual(400)
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toEqual('ObjectId not in prefs')
            let verif = await request(app)
                .get('/pref')
                .set('cookie', loginCookies)
            expect(verif.body.data).toEqual(['5d116e5e97114213e069dd35'])
        })
    })
})