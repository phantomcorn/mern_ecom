
# Login System (MERN) with Email verification
This is a login system using MERN stack with email verification. 
## 1 
To start, clone the repository locally.
## 2

Create an `.env` file in the root of the repo and add the following variables:

```
VITE_APP_BACKEND_URL = "http://localhost:3001"
VITE_APP_BASE_URL = "http://localhost:3000"
```

`VITE_APP_BACKEND_URL` and `VITE_APP_BASE_URL` are exposed in the frontend.
## 3
The rest are used in the backend:

```
MONGODB_API_KEY = <redacted>
```

This key can be found from your MongoDB cluster.

```
SMTP_FROM_EMAIL = <redacted>        
SMTP_HOST = <redacted>
SMTP_PORT = <redacted>
SMTP_USER = <redacted>
SMTP_PASS = <redacted>
```

This is taken from Mailtrap but you can use any email credentials.

## 4 
Once you login, you will have to use a secret key to encode your refresh and access token. 

1. A refresh token stored within your browser as an httpOnly cookie. This is use to generate your access token once they expires.
2. An access token which is added to your request header in every request to identify the logged in user.

To generate these token, we call `require('crypto').randomBytes(64).toString('hex')` and copy paste the value into `ACCESS_TOKEN_SECRET` env variable. We do the same thing for `REFRESH_TOKEN_SECRET`.

```
ACCESS_TOKEN_SECRET = <redacted>
REFRESH_TOKEN_SECRET = <redacted>
```

## 4
Run `npm install`
## 5
Run `npm run front` to start the frontend 
Run `npm run back` to start the backend server

