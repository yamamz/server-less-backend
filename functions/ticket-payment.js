const Tickets = require('./db/models/tickets')
var bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
let connection = require('./db/connection')
const middy = require('@middy/core')
const isJwtAuth = require("./middleware/authJwt");
const isAdmin = require('./middleware/isAdmin')
const verifySignUp = require('./middleware/verifySignUp')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
require('dotenv').config()



const makeid = (length) => {
    var result = "";
    var characters = "ABCDEFGHIJKLMNPQRSTUVWXYZ0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}


const makePayment = async (event, context) => {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    await connection()
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const charge = await stripe.charges.create({
            amount: event.body.amount * 100,
            currency: 'cad',
            description: 'Payment for ticket entries',
            source: event.body.token,
            metadata: { ticket_buy: `${event.body.ticketPcs} tickets buy`, fullname: event.body.fullname, email: event.body.email }
        });

        let tickets = [];
        const maxTicketId = await Tickets.countDocuments({}).exec();


        let startId = 0;

        if (maxTicketId) {
            startId = maxTicketId
        }

        for (let i = 1; i <= event.body.ticketPcs; i++) {
            startId++
            tickets.push({
                ticketNumber:
                    makeid(6) +
                    "-" +
                    startId,
                isFree: false,
                user: event.body.userId,
                draw: event.body.drawId,
                isSaleOnline: true,
            });
        }
        let totalPriceCheckout = event.body.ticketPcs * event.body.ticketPrice;
        if (totalPriceCheckout >= 20) {
            let freeTickets = Math.floor(totalPriceCheckout / 20);
            for (let i = 1; i <= freeTickets; i++) {
                startId++
                tickets.push({
                    ticketNumber:
                        'FREE' + makeid(3) +
                        "-" +
                        startId,
                    isFree: true,
                    user: event.body.userId,
                    draw: event.body.drawId,
                    isSaleOnline: true,
                });
            }
        }

        await Tickets.insertMany(tickets);
        return {
            statusCode: 200,
            body: JSON.stringify({
                charge: charge,
                tickets: tickets,
            })
        }

    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: err.message })
        }

    }
}

exports.handler = middy(makePayment).use(httpJsonBodyParser()).use(isJwtAuth())