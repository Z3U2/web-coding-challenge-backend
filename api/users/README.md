# User API Documentation

The `User` data model is available in [`model.js`](https://github.com/Z3U2/web-coding-challenge-backend/blob/master/api/users/model.js)

## `GET` requests

Request body expected to be empty

Response body general shape :
    
    {
        status : <statusCode>,
        message : <message>,
        data : <requestedData>
    }