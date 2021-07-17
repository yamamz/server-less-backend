const Draws = require('./db/models/draws')
var bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
let connection = require('./db/connection')
const middy = require('@middy/core')
const isJwtAuth = require("./middleware/authJwt");
const isAdmin = require('./middleware/isAdmin')
const verifySignUp = require('./middleware/verifySignUp')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const drawAdd = async (event, context) => {

    await connection()
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }
    let payLoad = event.body
    try {
        let draw = Draws({
            description: payLoad.description,
            startPeriodDate: payLoad.startPeriodDate,
            drawDate: payLoad.drawDate,
            ticketPrice: payLoad.ticketPrice,
            licence: payLoad.licence,
            numberOfTickets: payLoad.numberOfTickets,
        })
        await draw.save()
        return {
            statusCode: 200,
            body: JSON.stringify(draw)
        }
    } catch (error) {
        return {
            statusCode: 200,
            body: JSON.stringify(error.message)
        }
    }

}

exports.handler = middy(drawAdd).use(httpJsonBodyParser()).use(isJwtAuth()).use(isAdmin())



