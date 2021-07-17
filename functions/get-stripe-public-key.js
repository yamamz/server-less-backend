



const middy = require('@middy/core')
const authJwt = require("./middleware/authJwt");
const httpJsonBodyParser = require('@middy/http-json-body-parser')
require('dotenv').config()
const getStripePublicKey = async (event, context) => {
    console.log(process.env.STRIPE_PUBLIC_KEY)
    if (event.httpMethod !== "GET") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }
    try {


        return {
            statusCode: 200,
            body: JSON.stringify(process.env.STRIPE_PUBLIC_KEY)
        }
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(err.message)
        }

    }




}

exports.handler = middy(getStripePublicKey).use(authJwt()).use(httpJsonBodyParser({}))