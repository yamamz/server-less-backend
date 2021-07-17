const Donations = require('./db/models/donations')
var bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
let connection = require('./db/connection')
const middy = require('@middy/core')
const isJwtAuth = require("./middleware/authJwt");
const isAdmin = require('./middleware/isAdmin')
const verifySignUp = require('./middleware/verifySignUp')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
require('dotenv').config()

const makePayment = async (event, context) => {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    await connection()
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        console.log(event.body)
        const charge = await stripe.charges.create({
            amount: event.body.amount * 100,
            currency: 'cad',
            description: 'Donation for the fund raising',
            source: event.body.token,
            metadata: { fullname: event.body.fullname, email: event.body.email, phone: event.body.phone }
        });
        const customer = new Donations({
            fullname: event.body.fullname,
            address: event.body.address,
            phone: event.body.phone,
            email: event.body.email,
            amount: event.body.amount,
        })
        await customer.save()
        return {
            statusCode: 200,
            body: JSON.stringify({ charge, customer })
        }

    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(err.message)
        }
    }
}

exports.handler = middy(makePayment).use(httpJsonBodyParser()).use(isJwtAuth())