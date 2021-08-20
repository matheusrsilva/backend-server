# backend-server

This is a fast created Restful API from scratch using `express.js`.
The idea is to be able to register yourself, authenticate yourself and create some public text content(post).
You can also update your data, update or delete your posts and make them private.
Most of user data is private, with some exceptions. 

### Initial Setup
1. Run ```npm i``` to install all dependencies;
2. Use the database schema on ```./test/backend-server``` to create the needed database;
    1. user and password are setted on code, on ```./src/config/database```
3. Run ```npm start``` to start server, on http://localhost:3000 

### How to use
- `Content-Type` is `application/json`, so  body content must be `json`
- For authenticated use, you must set Authorization on header from on the login return. 


### Valid endpoints
- POST `/user`:
    - Create user with the body data,
    - `username, password and fullname` are required,
    - `username` must be a valid email
    - Returns user data
 
- POST `/user/login`:
    - Gets or Creates a token for the user that matches given `username` and `password`,
    - `username and password` are required
    - Returns a valid token to access user restricted content
 
- GET `/user`:
    - Must have Authorization header set
    - Returns user data who owns the given token
    
    
- GET `/user/:id`:
    - Can have Authorization header set
    - Returns user data from id
    - If token user is not the same from id, it restricts some data

- PUT `/user/:id`:
    - Must have Authorization header set
    - Updates user with the given id
    - `username` cannot be updated
    - To update password, must send the **new password as `password`**, and the **old one as `old_password`**
    - Returns user data from id
    
