
const Tickets = require('./db/models/tickets')
var bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
let connection = require('./db/connection')
const middy = require('@middy/core')
const isJwtAuth = require("./middleware/authJwt");
const isAdmin = require('./middleware/isAdmin')
const verifySignUp = require('./middleware/verifySignUp')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
require('./db/models/draws')
require('./db/models/users')
const ticketByDraw = async (event, context) => {

    await connection()
    if (event.httpMethod !== "GET") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const id = event.queryStringParameters.id

        const tickets = await Tickets.find(
            {
                user: id
            }
        ).populate({ path: 'user', select: '_id firstName lastName email contact' })
            .populate({ path: 'draw' })
            .exec();



        return {
            statusCode: 200,
            body: JSON.stringify({ tickets })
        }


    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error.message)
        }
    }

}

exports.handler = middy(ticketByDraw).use(httpJsonBodyParser()).use(isJwtAuth())








