const dotenv = require('dotenv')
dotenv.config({ path: __dirname + '/test.env' })
const express = require('express');
const app = express();
const request = require('supertest');
const mongoose = require('mongoose');
const { ShopAPI } = require('./api')
const { initDB,cleanDB } = require('../../test-set/DB')


beforeAll(async () => {
    try {
        await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true })
        const shopAPI = new ShopAPI()
        await cleanDB()
        app.use('/',shopAPI.router)
        return
    }
    catch (e) {
        throw e
    }
});

// beforeEach(async() => {
//     await initDB()
//     return
// })

// afterEach(async () => {
//     await cleanDB()
//     return
// })

describe('GET tests', () => {

    beforeAll(async () => {
        await initDB()
        return
    })

    afterAll(async () => {
        await cleanDB()
        return
    })

    test('GET /', async () => {
        let res = await request(app).get('/');
        expect(res.status).toEqual(200);
        expect(res.body.data.length).toEqual(20);
    });
    test('GET /5d116e5e97114213e069dd27', async () => {
        let res = await request(app).get('/5d116e5e97114213e069dd27')
        expect(res.status).toEqual(200)
        expect(res.body.data).toEqual({
            __v: 0,
            _id: "5d116e5e97114213e069dd27",
            name: "Parfumerie Zahrat Arriad",
            location: {
                _id: "5d116e5e97114213e069dd28",
                type: "Point",
                coordinates: [
                    -6.868422599999999,
                    33.9576474
                ]
            }
        });
    })
    test('GET /inexistentShop', async () => {
        let res = await request(app).get(`/${new mongoose.Types.ObjectId}`)
        expect(res.status).toEqual(404)
    })
});

describe('POST tests', () => {
    beforeEach(async () => {
        await initDB()
        return
    })

    afterEach(async () => {
        await cleanDB()
        return
    })
    test('POST / with correct input', async () => {
        let res = await request(app)
            .post('/')
            .set('Content-Type', 'application/json')
            .send({
                name: 'STARCUPS',
                location : {
                    type : 'Point',
                    coordinates : [
                        -6.866521,
                        33.955940
                    ]
                }
            })
        expect(res.status).toEqual(200)
        expect(res.body).toHaveProperty('id')
        let id = res.body.id
        let verification = await request(app)
            .get(`/${id}`)
        expect(verification.status).toEqual(200)
        let obj = verification.body.data
        delete obj._id
        delete obj.location._id
        delete obj.__v
        expect(obj).toEqual({
            name: 'STARCUPS',
            location: {
                type: 'Point',
                coordinates: [
                    -6.866521,
                    33.955940
                ]
            }
        })
    })
    test('POST / without name', async () => {
        let res = await request(app)
            .post('/')
            .set('Content-Type', 'application/json')
            .send({
                location: {
                    type: 'Point',
                    coordinates: [
                        -6.866521,
                        33.955940
                    ]
                }
            });
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toEqual('Missing name')
    })
    test('POST / without location', async () => {
        let res = await request(app)
            .post('/')
            .set('Content-Type', 'application/json')
            .send({
                name: 'STARCUPS',
            });
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Missing location');
    });
    test('POST / incorrect location type', async () => {
        let res = await request(app)
            .post('/')
            .set('Content-Type', 'application/json')
            .send({
                name: 'STARCUPS',
                location: {
                    type: 'test',
                    coordinates: [
                        -6.866521,
                        33.955940
                    ]
                }
            });
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('incorrect location type');
    });
    test('POST / incorrect location coordinates', async () => {
        let res = await request(app)
            .post('/')
            .set('Content-Type', 'application/json')
            .send({
                name: 'STARCUPS',
                location: {
                    type: 'test',
                    coordinates: [
                        -6.866521,
                        33.955940
                    ]
                }
            });
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('incorrect location coordinates');
    });
})
