
const config = require("../config/auth.config");
const express = require('express')
const paymentRoute = express.Router()
const { authJwt } = require("../middleware");
const nodemailer = require('nodemailer');
const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const Tickets = require('./../db/models/tickets')
const Donations = require('./../db/models/donations')
const payment = async (req, res) => {

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.ticketPcs * 5 * 100,
        currency: "cad"
    });
    res.send({
        setupIntent: paymentIntent
    });
}

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

const chargePayment = async (req, res) => {
    try {
        const charge = await stripe.charges.create({
            amount: req.body.amount * 100,
            currency: 'cad',
            description: 'Payment for ticket entries',
            source: req.body.token,
            metadata: { ticket_buy: `${req.body.ticketPcs} tickets buy`, fullname: req.body.fullname, email: req.body.email }
        });

        let tickets = [];
        const maxTicketId = await Tickets.countDocuments({}).exec();


        let startId = 0;

        if (maxTicketId) {
            startId = maxTicketId
        }

        for (let i = 1; i <= req.body.ticketPcs; i++) {
            startId++
            tickets.push({
                ticketNumber:
                    makeid(6) +
                    "-" +
                    startId,
                isFree: false,
                user: req.body.userId,
                draw: req.body.drawId,
                isSaleOnline: true,
            });
        }
        let totalPriceCheckout = req.body.ticketPcs * req.body.ticketPrice;
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
                    user: req.body.userId,
                    draw: req.body.drawId,
                    isSaleOnline: true,
                });
            }
        }

        await Tickets.insertMany(tickets);
        res.send({
            charge: charge,
            tickets: tickets,
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }

}

const donatePayment = async (req, res) => {
    try {
        console.log(req.body)
        const charge = await stripe.charges.create({
            amount: req.body.amount * 100,
            currency: 'cad',
            description: 'Donation for the fund raising',
            source: req.body.token,
            metadata: { fullname: req.body.fullname, email: req.body.email, phone: req.body.phone }
        });
        const customer = new Donations({
            fullname: req.body.fullname,
            address: req.body.address,
            phone: req.body.phone,
            email: req.body.email,
            amount: req.body.amount,
        })
        await customer.save()
        res.send({ charge, customer })
    } catch (err) {
        res.status(500).send(err.message)
    }

}

const cancelCheckout = async (req, res) => {
    try {

        const setupIntent = await stripe.paymentIntents.cancel(
            req.body.setupIntentId
        );
        res.send(setupIntent)
    } catch (err) {
        res.status(500).send({ message: 'there is an error occured when cancelling' })
    }

}


const getStripePublicKey = async (req, res) => {
    try {


        res.send({
            key: keys.stripePublicKey
        })
    } catch (err) {
        res.status(500).send({ message: 'there is an error occured when cancelling' })
    }

}

paymentRoute.post(
    "/ckeckoutPayment",
    [authJwt.verifyToken],
    payment
);
paymentRoute.get(
    "/getStripePublicKey",
    [authJwt.verifyToken],
    getStripePublicKey
);
paymentRoute.post(
    "/donatePayment",
    [authJwt.verifyToken],
    donatePayment
);

paymentRoute.post(
    "/chargePayment",
    [authJwt.verifyToken],
    chargePayment
);

paymentRoute.post(
    "/checkoutCancel",
    [authJwt.verifyToken],
    cancelCheckout
);


paymentRoute.post(
    "/sendEmailReciept",
    [authJwt.verifyToken],
    async (req, res) => {
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
                to: req.body.email,
                subject: 'Ticket purchased confirmation',
                html: htmlBody,
                attachments: [
                    {   // encoded string as an attachment
                        filename: 'tickets.pdf',
                        content: req.body.ticketBase64,
                        encoding: 'base64'
                    }
                ]
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    res.status(500).send({ success: false })
                } else {
                    res.send({ success: true })
                }
            });
        } catch (err) {
            res.status(500).send({ success: false })
        }

    }
);






module.exports = paymentRoute