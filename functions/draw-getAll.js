const Draws = require('./db/models/draws')
var bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
let connection = require('./db/connection')
const middy = require('@middy/core')
const isJwtAuth = require("./middleware/authJwt");
const isAdmin = require('./middleware/isAdmin')
const verifySignUp = require('./middleware/verifySignUp')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const drawGetAll = async (event, context) => {

    await connection()
    if (event.httpMethod !== "GET") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }
    try {
        const draws = await Draws.find({}).populate('tickets')
            .exec();
        console.log(draws)
        return {
            statusCode: 200,
            body: JSON.stringify({ draws })
        }

    } catch (error) {
        return {
            statusCode: 200,
            body: JSON.stringify(error.message)
        }

    }

}

exports.handler = middy(drawGetAll).use(httpJsonBodyParser()).use(isJwtAuth()).use(isAdmin())



















