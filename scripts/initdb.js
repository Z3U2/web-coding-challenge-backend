const mongoose = require('mongoose')
const { initDB } = require('../test-set/DB')

if (!process.argv[2]) {
    console.log("Missing argument : DB_URL")
    process.exit(1)
}

let DB_URL = process.argv[2]

populateDB(DB_URL)
    .then(() => {
        console.log("Done")
        process.exit(0)
    })
    .catch(err => {
        console.error(err)
        process.exit(1)
    })

async function populateDB(DB_URL) {
    await mongoose.connect(
        DB_URL,
        {
            useNewUrlParser: true,
            useFindAndModify: false
        })
    await initDB()
    return
}