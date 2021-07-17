const Tickets = require('./db/models/tickets')
var bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
let connection = require('./db/connection')
const middy = require('@middy/core')
const isJwtAuth = require("./middleware/authJwt");
const isAdmin = require('./middleware/isAdmin')
const verifySignUp = require('./middleware/verifySignUp')
const httpJsonBodyParser = require('@middy/http-json-body-parser')


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

const ticketGenerate = async (event, context) => {

    await connection()
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {

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
                isSaleOnline: false,
                soldOut: false,
            });
        }
        await Tickets.insertMany(tickets);
        const ticketsByDraw = await Tickets.find(
            {
                draw: event.body.drawId,

            }
        ).populate({ path: 'user', select: '_id firstName lastName email contact' })
            .populate('draw').exec();

        return {
            statusCode: 200,
            body: JSON.stringify({ tickets: ticketsByDraw })
        }

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error.message)
        }
    }

}

exports.handler = middy(ticketGenerate).use(httpJsonBodyParser()).use(isJwtAuth()).use(isAdmin())












