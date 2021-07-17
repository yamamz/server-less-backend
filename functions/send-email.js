const Tickets = require('./db/models/tickets')
var bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
let connection = require('./db/connection')
const middy = require('@middy/core')
const isJwtAuth = require("./middleware/authJwt");
const isAdmin = require('./middleware/isAdmin')
const verifySignUp = require('./middleware/verifySignUp')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const nodemailer = require('nodemailer');

async function wrapedSendMail(mailOptions) {
    return new Promise((resolve, reject) => {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'draw.meditationgarden@gmail.com',
                pass: 'ibflfiookahrfeok' // naturally, replace both with your real credentials or an application-specific password
            }
        });

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("error is " + error);
                resolve(false); // or use rejcet(false) but then you will have to handle errors
            }
            else {
                console.log('Email sent: ' + info.response);
                resolve(true);
            }
        });

    });

}


const sendEmail = async (event, context) => {


    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'draw.meditationgarden@gmail.com',
                pass: 'ibflfiookahrfeok' // naturally, replace both with your real credentials or an application-specific password
            }
        });

        let htmlBody = `<h1><b>Thank you for joining the fundraising raffle draw</b></h1>
           <p>Please see attatched document for the copy of your ticket</p>
            `;
        const mailOptions = {
            from: 'draw.meditationgarden@gmail.com',
            to: event.body.email,
            subject: 'Ticket purchased confirmation',
            html: htmlBody,
            attachments: [
                {   // encoded string as an attachment
                    filename: 'tickets.pdf',
                    content: event.body.ticketBase64,
                    encoding: 'base64'
                }
            ]
        };

        await wrapedSendMail(mailOptions);
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        }


    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false })
        }
    }
}

exports.handler = middy(sendEmail).use(httpJsonBodyParser()).use(isJwtAuth())








