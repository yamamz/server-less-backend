const Draws = require('./db/models/draws')
var bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
let connection = require('./db/connection')
const middy = require('@middy/core')
const isJwtAuth = require("./middleware/authJwt");
const isAdmin = require('./middleware/isAdmin')
const verifySignUp = require('./middleware/verifySignUp')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const drawUpdate = async (event, context) => {

    await connection()
    if (event.httpMethod !== "PUT") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }
    let payLoad = event.body
    console.log(event)
    try {
        const id = event.queryStringParameters.id

        const draw = await Draws.findOneAndUpdate({ _id: id }, payLoad, { new: true });
        if (draw) {


            return {
                statusCode: 200,
                body: JSON.stringify({ draw })
            }
        } else {

            return {
                statusCode: 500,
                body: JSON.stringify('draw id does not exists')
            }
        }

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error.message)
        }
    }

}

exports.handler = middy(drawUpdate).use(httpJsonBodyParser()).use(isJwtAuth()).use(isAdmin())



