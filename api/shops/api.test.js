const dotenv = require('dotenv')
dotenv.config({ path: __dirname + '/test.env' })
const express = require('express');
const app = express();
const request = require('supertest');
const mongoose = require('mongoose');
const { ShopAPI } = require('./api')
const { initDB,cleanDB } = require('../../test-set/DB')
const { getLoginCookies } = require('../../test-set/utils')

beforeAll(async () => {
    try {
        await mongoose.connect(
            process.env.DB_URL,
            { 
                useNewUrlParser: true,
                useFindAndModify: false 
            })
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
    describe('GET /nearme tests', () => {
        let loginCookies
        beforeAll(async () => {
            loginCookies = await getLoginCookies()
        })
        test('GET /nearme correct inputs', async () => {
            const orderedIds = [
                "5d116e5e97114213e069dd27",
                "5d116e5e97114213e069dd29",
                "5d116e5e97114213e069dd2b",
                "5d116e5e97114213e069dd2d",
                "5d116e5e97114213e069dd2f",
                "5d116e5e97114213e069dd31",
                "5d116e5e97114213e069dd33",
                "5d116e5e97114213e069dd39",
                "5d116e5e97114213e069dd3b",
                "5d116e5e97114213e069dd3d",
                "5d116e5e97114213e069dd3f",
                "5d116e5e97114213e069dd41",
                "5d116e5e97114213e069dd43",
                "5d116e5e97114213e069dd45",
                "5d116e5e97114213e069dd47",
                "5d116e5e97114213e069dd49",
                "5d116e5e97114213e069dd4b",
                "5d116e5e97114213e069dd4d"
            ]
            let res = await request(app)
                .get('/nearme?lat=33.957880&lng=-6.867932')
                .set('cookie',loginCookies)
            expect(res.status).toEqual(200);
            expect(res.body.data[0]).toHaveProperty('dist')
            expect(res.body.data.map(place => place._id)).toEqual(orderedIds);
        })
        test('GET /nearme incorrect lat', async () => {
            let res = await request(app)
                .get('/nearme?lat=af35&lng=-6.867932')
                .set('cookie', loginCookies)
            expect(res.status).toEqual(400);
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toEqual('lat should be a number between -90 and 90')
        })
        test('GET /nearme incorrect lng', async () => {
            let res = await request(app)
                .get('/nearme?lat=35&lng=af-6.867932')
                .set('cookie', loginCookies)
            expect(res.status).toEqual(400);
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toEqual('lng should be a number between -180 and 180')
        })
        test('GET /nearme Missing lng', async () => {
            let res = await request(app)
                .get('/nearme?lat=35')
                .set('cookie', loginCookies)
            expect(res.status).toEqual(400);
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toEqual('Missing lng')
        })
        test('GET /nearme Missing lat', async () => {
            let res = await request(app)
                .get('/nearme?lng=35')
                .set('cookie', loginCookies)
            expect(res.status).toEqual(400);
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toEqual('Missing lat')
        })
        test('GET /nearme Unknown query parameter', async () => {
            let res = await request(app)
                .get('/nearme?lat=33.957880&lng=-6.867932&test=test')
                .set('cookie', loginCookies)
            expect(res.status).toEqual(400);
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toEqual('Unknown query parameter : test')
        })
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
    test('POST / Missing location type', async () => {
        let res = await request(app)
            .post('/')
            .set('Content-Type', 'application/json')
            .send({
                name: 'STARCUPS',
                location: {
                    coordinates: [
                        -6.866521,
                        33.955940
                    ]
                }
            });
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Missing location type');
    });
    test('POST / Missing location coordinates', async () => {
        let res = await request(app)
            .post('/')
            .set('Content-Type', 'application/json')
            .send({
                name: 'STARCUPS',
                location: {
                    type: 'Point',
                }
            });
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Missing location coordinates');
    });
    test('POST / non string location type', async () => {
        let res = await request(app)
            .post('/')
            .set('Content-Type', 'application/json')
            .send({
                name: 'STARCUPS',
                location: {
                    type: {},
                    coordinates: [
                        -6.866521,
                        33.955940
                    ]
                }
            });
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Location type should be of type String');
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
        expect(res.body.message).toEqual('Shop location type should be "Point"');
    });
    test('POST / location.coordinates not an array', async () => {
        let res = await request(app)
            .post('/')
            .set('Content-Type', 'application/json')
            .send({
                name: 'STARCUPS',
                location: {
                    type: 'Point',
                    coordinates: {
                        lat : 6,
                        lng : 40
                    }
                }
            });
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('location.coordinates should be of type "Array"')
    });
    test('POST / incorrect location coordinates type', async () => {
        let res = await request(app)
            .post('/')
            .set('Content-Type', 'application/json')
            .send({
                name: 'STARCUPS',
                location: {
                    type: 'Point',
                    coordinates: [
                        'lng',
                        'lat',
                    ]
                }
            });
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('location.coordinates should be an array of numbers')
    });
    test('POST / incorrect location coordinates length', async () => {
        let res = await request(app)
            .post('/')
            .set('Content-Type', 'application/json')
            .send({
                name: 'STARCUPS',
                location: {
                    type: 'Point',
                    coordinates: [
                        -6.866521,
                        33.955940,
                        'hello'
                    ]
                }
            });
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('location.coordinates should be of length 2 : [lng,lat]')
    });
})

describe('DELETE tests', () => {
    beforeAll(async () => {
        await initDB()
        return
    })

    afterAll(async () => {
        await cleanDB()
        return
    })
    test('DELETE /5d116e5e97114213e069dd31', async () => {
        let res = await request(app)
            .delete('/5d116e5e97114213e069dd31')
        expect(res.status).toEqual(200)
        let verification = await request(app)
            .get('/5d116e5e97114213e069dd31')
        expect(verification.status).toEqual(404)
    })
    test('DELETE /inexistentShop', async () => {
        let res = await request(app)
            .delete(`/${new mongoose.Types.ObjectId}`)
        expect(res.status).toEqual(404)
    })
})

describe('PUT tests', () => {
    beforeEach(async () => {
        await initDB()
        return
    })

    afterEach(async () => {
        await cleanDB()
        return
    })
    test('PUT /:id with correct input', async () => {
        let res = await request(app)
            .put('/5d116e5e97114213e069dd27')
            .set('Content-Type', 'application/json')
            .send({
                name: 'Some place',
                location: {
                    type: 'Point',
                    coordinates: [
                        -5,
                        40
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
            name: 'Some place',
            location: {
                type: 'Point',
                coordinates: [
                    -5,
                    40
                ]
            }
        })
    })
    test('PUT /inexistentShop', async () => {
        let res = await request(app)
            .put(`/${new mongoose.Types.ObjectId}`)
            .set('Content-Type', 'application/json')
            .send({
                name: 'STARCUPS',
                location: {
                    type : 'Point',
                    coordinates: [
                        -6.866521,
                        33.955940
                    ]
                }
            });
        expect(res.status).toEqual(404);
    });
    test('PUT /:id Missing location type', async () => {
        let res = await request(app)
            .put('/5d116e5e97114213e069dd27')
            .set('Content-Type', 'application/json')
            .send({
                name: 'STARCUPS',
                location: {
                    coordinates: [
                        -6.866521,
                        33.955940
                    ]
                }
            });
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Missing location type');
    });
    test('PUT /:id Missing location coordinates', async () => {
        let res = await request(app)
            .put('/5d116e5e97114213e069dd27')
            .set('Content-Type', 'application/json')
            .send({
                name: 'STARCUPS',
                location: {
                    type: 'Point',
                }
            });
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Missing location coordinates');
    });
    test('PUT /:id non string location type', async () => {
        let res = await request(app)
            .put('/5d116e5e97114213e069dd27')
            .set('Content-Type', 'application/json')
            .send({
                name: 'STARCUPS',
                location: {
                    type: {},
                    coordinates: [
                        -6.866521,
                        33.955940
                    ]
                }
            });
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Location type should be of type String');
    });
    test('PUT /:id incorrect location type', async () => {
        let res = await request(app)
            .put('/5d116e5e97114213e069dd27')
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
        expect(res.body.message).toEqual('Shop location type should be "Point"');
    });
    test('PUT /:id location.coordinates not an array', async () => {
        let res = await request(app)
            .put('/5d116e5e97114213e069dd27')
            .set('Content-Type', 'application/json')
            .send({
                name: 'STARCUPS',
                location: {
                    type: 'Point',
                    coordinates: {
                        lat: 6,
                        lng: 40
                    }
                }
            });
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('location.coordinates should be of type "Array"')
    });
    test('PUT /:id incorrect location coordinates type', async () => {
        let res = await request(app)
            .put('/5d116e5e97114213e069dd27')
            .set('Content-Type', 'application/json')
            .send({
                name: 'STARCUPS',
                location: {
                    type: 'Point',
                    coordinates: [
                        'lng',
                        'lat',
                    ]
                }
            });
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('location.coordinates should be an array of numbers')
    });
    test('PUT /:id incorrect location coordinates length', async () => {
        let res = await request(app)
            .put('/5d116e5e97114213e069dd27')
            .set('Content-Type', 'application/json')
            .send({
                name: 'STARCUPS',
                location: {
                    type: 'Point',
                    coordinates: [
                        -6.866521,
                        33.955940,
                        'hello'
                    ]
                }
            });
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('location.coordinates should be of length 2 : [lng,lat]')
    });
})