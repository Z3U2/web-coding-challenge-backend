# web-coding-challenge-backend
Backend for UR [web-coding-challenge](https://github.com/hiddenfounders/web-coding-challenge) : Nearby Shop Listing App

Functional specs from the challenge's repo : 
> The coding challenge is about implementing an app that lists shops nearby. 
>
> - As a User, I can sign up using my email & password
> - As a User, I can sign in using my email & password
> - As a User, I can display the list of shops sorted by distance
> - As a User, I can like a shop, so it can be added to my preferred shops
  > - Acceptance criteria: liked shops shouldn’t be displayed on the main page
>
> Bonus point (those items are optional):
> - [BONUS] As a User, I can dislike a shop, so it won’t be displayed within “Nearby Shops” list during the next 2 hours
> - [BONUS] As a User, I can display the list of preferred shops
> - [BONUS] As a User, I can remove a shop from my preferred shops list
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

* `users` : stores users ([Schema](https://github.com/Z3U2/web-coding-challenge-backend/blob/master/api/users/model.js))
* `shops` : stores shops ([Schema](https://github.com/Z3U2/web-coding-challenge-backend/blob/master/api/shops/model.js))
* `sessions` : stores sessions, managed by `connect-mongo` package

#### Indexes :

You need to create 2 indexes :

* `2dsphere` index for `location` field in `shops` collection
* `unique` regular ( `1` ) index for `email` field in `users` collection
* `sessions`' `expires` index **managed by `connect-mongo` package**

## Run :

Once setup is finished you can run the server with :
    
    npm start

## API : 

The API is generally RESTFUL and returns results in JSON. Enpoints and JSON formats dealt by the API are documented in each of the API's subfolders' READMEs: 
* `/users` : [Documentation](https://github.com/Z3U2/web-coding-challenge-backend/blob/master/api/users/README.md)
* `/shops` : [Documentation](https://github.com/Z3U2/web-coding-challenge-backend/blob/master/api/shops/README.md)

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

⚠️ Generally all POST and PUT requests expect JSON request body

## Authentication :
* CRUD : JWT (yet to implement)
* `/users/pref` and `/shops/nearme` : [session cookies](#session-cookies-authentication-)

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
