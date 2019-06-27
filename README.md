# web-coding-challenge-backend
Backend for UR web-coding-challenge : Nearby Shop Listing App

## Setup :

Do not forget to install packages with

    npm install
    
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

## Run :

Once setup is finished you can run the server with :
    
    npm start