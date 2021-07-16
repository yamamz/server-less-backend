const Users = require('./db/models/users')
var bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
let connection = require('./db/connection')
const middy = require('@middy/core')
const authJwt = require("./middleware/authJwt");
const httpJsonBodyParser = require('@middy/http-json-body-parser')

const session = async (event, context) => {
    await connection()
    console.log('here')
    if (event.httpMethod !== "GET") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }
    try {
        const user = await Users.findOne({ _id: event.userId })
        return {
            statusCode: 200,
            body: JSON.stringify({
                "description": "User Content Page",
                "user": user
            })
        }

    } catch (err) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                "description": "Can not access User Page",
                "error": err.message
            })
        }

    }




}

exports.handler = middy(session).use(authJwt()).use(httpJsonBodyParser({}))

