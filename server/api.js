const express = require("express");
const serverless = require("serverless-http");
const app = express();
const apiRoutes = express.Router()

const cookieParser = require("cookie-parser")


require('./db/connection')


app.use(express.json({ limit: '50000mb' }))
app.use(express.urlencoded({
    extended: true, limit: '50000mb'
}))

app.use(cookieParser())
// "Access-Control-Allow-Headers",
// "x-access-token, Origin, Content-Type, Accept"
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT")
    res.header("Access-Control-Allow-Headers", "origin, content-type, authorization, x-access-token, Accept")
    res.header("Content-Type", "application/json")
    if (req.method === "OPTIONS") {
        res.sendStatus(200);
    } else {
        next()
    }
})






// API routes


apiRoutes.use('/auth', require('./router/auth.route'))
apiRoutes.use('/payment', require('./router/payment.route'))
apiRoutes.use('/draw', require('./router/draw.route'))
apiRoutes.use('/ticket', require('./router/ticket.route'))
apiRoutes.use('/test', require('./router/test.route'))



app.use(`/.netlify/functions/api`, apiRoutes);
module.exports = app;
module.exports.handler = serverless(app);