# Shop API Documentation

The `Shop` data model is available in [`model.js`](https://github.com/Z3U2/web-coding-challenge-backend/blob/master/api/shops/model.js)

## `GET` requests

Request body expected to be empty

Response body general shape :
    
    {
        status : <statusCode>,
        message : <message>,
        data : <requestedData>
    }

### `/nearme`

⚠️ Session authentication required ! 

Expects URL query parameters `lat` and `lng`

Responds with an array of shops (distance from user included for each shop)

**Example** :

- Request :

        GET /nearme?lat=33.957880&lng=-6.867932
- Response :

        {
            ...,
            data : [
                {
                    name : <name>,
                    location: <location>,
                    dist : <distance>
                },
                ...
            ]
        }