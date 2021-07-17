const Tickets = require('./db/models/tickets')
var bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
let connection = require('./db/connection')
const middy = require('@middy/core')
const isJwtAuth = require("./middleware/authJwt");
const isAdmin = require('./middleware/isAdmin')
const verifySignUp = require('./middleware/verifySignUp')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const validateTicket = async (event, context) => {

    await connection()
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {

        await Tickets.find({ '_id': { $in: event.body } }).updateMany({ $set: { soldOut: true } }).exec();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'success' })
        }

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error.message)

        }


    }

}

exports.handler = middy(validateTicket).use(httpJsonBodyParser()).use(isJwtAuth()).use(isAdmin())








