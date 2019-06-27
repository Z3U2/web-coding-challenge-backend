# web-coding-challenge-backend
Backend for UR web-coding-challenge : Nearby Shop Listing App

## Setup :

### Packages

Do not forget to install packages with

    npm install

### Environment

This project uses dotenv to setup environment : 

* api unit tests : 
    * `api/shops/test.env`
    * `api/users/test.env`
    
    Expecting : 
        
        DB_URL=<validmongodbconnectionurl>
    Each endpoint should have its own testing database

* auth : 
    * `api/users/helper/auth/auth.env`
    
    Expecting : 
        
        SECRET=<randomlyGeneratedString>
    Serves as secret for sessions encryption

* global env file :
    * `.env` 

    Expecting : 
        
        DB_URL=<validmongodbconnectionurl>
        PORT=<portnumber>
        DB_URL is necessary, PORT number defaults to 3000

### Database

This project uses mongodb (version >= 4.0), So you need to have a local or remote mongodb instance.

#### Collections : 

* `users` : stores users
* `shops` : stores shops
* `sessions` : stores sessions, managed by `connect-mongo` package

#### Indexes :

* `2dsphere` index for `location` field in `shops` collection
* `unique` regular ( `1` ) index for `email` field in `users` collection
* `sessions`' `expires` index managed by `connect-mongo` package

## Run :

Once setup is finished you can run the server with :
    
    npm start

## API : 

The API is generally RESTFUL and returns results in JSON. JSON formats dealt by the API are documented [here](https://github.com/Z3U2/web-coding-challenge-backend/blob/master/API_DOC.md).

### Example :
`GET` request to `/users/` returns a response in this shape :

    {
        status : 200,
        message : "Successfully received users"
        data : [
            {
                _id : <userId>,
                email : <userEmail>,
                password : <userPassword>
            },
            // ... (other users)
        ]
    }

⚠️ All POST and PUT requests expect JSON request body

## Authentication :
* CRUD : JWT (yet to implement)
* `/users/pref` and `/shops/nearme` : [session cookies](#session-cookies-authentication)

### Session Cookies Authentication : 

`POST` to `/users/login` with request body :
    
    {
        email : <userEmail>,
        password : <userPassword>
    }

Should respond with a successful login JSON and set a valid session cookie if the credentials are correct.

## Test :

Once setup is finished you can run the server with :
    
    npm test

⚠️ **Note** : tests related to `GET /shops/nearme` won't pass unless you comment the `authRequired` middleware line in the file `api/shops/api.js`. This is due to `supertest` not being able to keep cookies (unlike `superagent`), I'm working on this issue.