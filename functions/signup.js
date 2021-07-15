const Users = require('./db/models/users')
var bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
let connection = require('./db/connection')
const middy = require('@middy/core')
const authJwt = require("./middleware/authJwt");
const isAdmin = require('./middleware/isAdmin')
const verifySignUp = require('./middleware/verifySignUp')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const signup = async (event, context) => {

    await connection()
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }
    let payLoad = event.body
    try {
        const user = new Users({
            username: payLoad.username,
            email: payLoad.email,
            firstName: payLoad.firstName,
            lastName: payLoad.lastName,
            address: payLoad.address,
            contact: payLoad.contact,
            password: bcrypt.hashSync(payLoad.password, 8),
            role: payLoad.role
        })

        await user.save()
        return {
            statusCode: 200,
            body: JSON.stringify(user)
        }

    } catch (err) {
        return {
            statusCode: 200,
            body: JSON.stringify({ message: err.message })
        }
    }

}

exports.handler = middy(signup).use(httpJsonBodyParser()).use(verifySignUp())