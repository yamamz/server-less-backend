const Users = require('./db/models/users')
var bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
let connection = require('./db/connection')
const middy = require('@middy/core')
const authJwt = require("./middleware/authJwt");
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const login = async (event, context) => {
    await connection()
    console.log('here')
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }
    let payLoad = event.body
    let user = await Users.findOne({

        username: payLoad.username
    })
    if (!user) {
        return {
            statusCode: 401,
            body: JSON.stringify({
                accessToken: null,
                message: "Invalid username!"
            })
        }
    }

    var passwordIsValid = bcrypt.compareSync(
        payLoad.password,
        user.password
    );

    if (!passwordIsValid) {
        return {
            statusCode: 401,
            body: JSON.stringify({
                accessToken: null,
                message: "Invalid Password!"
            })
        }
    }

    var token = jwt.sign({ id: user.id }, 'this is very sectret', {
        expiresIn: 86400 // 24 hours
    });

    return {
        statusCode: 200,
        body: JSON.stringify({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            accessToken: token,
        })
    }


}

exports.handler = middy(login).use(httpJsonBodyParser({}))