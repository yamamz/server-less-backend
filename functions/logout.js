const Users = require('./db/models/users')
var bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
let connection = require('./db/connection')
const middy = require('@middy/core')
const authJwt = require("./middleware/authJwt");
const httpJsonBodyParser = require('@middy/http-json-body-parser')

const logout = async (event, context) => {
    try {
        let randomNumberToAppend = toString(Math.floor((Math.random() * 1000) + 1));
        let randomIndex = Math.floor((Math.random() * 10) + 1);
        let hashedRandomNumberToAppend = await bcrypt.hash(randomNumberToAppend, 10);

        // now just concat the hashed random number to the end of the token
        event.token = event.token + hashedRandomNumberToAppend;
        return {
            statusCode: 200,
            body: JSON.stringify('logout')
        }
    } catch (err) {
        return {
            statusCode: 200,
            body: JSON.stringify(err.message)
        }
    }



}

exports.handler = middy(logout).use(authJwt()).use(httpJsonBodyParser({}))




