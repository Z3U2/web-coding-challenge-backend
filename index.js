const dotenv = require('dotenv')
dotenv.config()

async function start() {
    const express = require('express'),
        app = express(),
        mongoose = require('mongoose'),
        cors = require('cors')

    if (!process.env.DB_URL) {
        console.error('Please set DB_URL in .env !')
        process.exit(1)
    }
    await mongoose.connect(
        process.env.DB_URL,
        {
            useNewUrlParser: true,
            useFindAndModify: false
        })
    const { API } = require('./api/api')
    const api = new API()
    const router = api.router
    app.use('/', cors({
        credentials: true,
        origin: [
            'http://localhost:3000'
        ]
    }))
    app.use('/', router)
    const PORT = process.env.PORT || 3000
    app.listen(PORT)
    console.log(`Listening on port : ${PORT}`)
}

start().then(() => {
    console.log('Server Started')
})