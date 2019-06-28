const express = require('express')
const app = express()
const request = require('supertest')
const {UserAPI} = require('../api/users/api')
const userAPI = new UserAPI()
const router = userAPI.router
app.use('/', router)

const userAccount = {
    email: "test1@example.com",
    password: "Hello"
}

function extractCookies(res) {
    return res.header['set-cookie'].map(cookieString => {
        return cookieString.split('; ').map(cookie => {
            let [key, value] = cookie.split('=')
            return {
                key,
                value
            }
        })
    })
}

async function getLoginCookies() {
    let res = await request(app)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send(userAccount)
    return res.header['set-cookie']
}

module.exports.extractCookies = extractCookies
module.exports.getLoginCookies = getLoginCookies