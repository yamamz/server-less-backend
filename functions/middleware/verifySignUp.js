
const jwt = require("jsonwebtoken");

const Users = require('./../db/models/users')
let connection = require('./../db/connection')

var bcrypt = require("bcryptjs");
const defaults = {}

module.exports = (opts = {}) => {
    const options = { ...defaults, ...opts }

    const verifySignUp = async (request) => {
        await connection()
        let userUsername = await Users.findOne({
            username: request.event.body.username
        })

        if (userUsername) {

            return {
                statusCode: 400,
                body: JSON.stringify({

                    message: "Failed! Username is already in use!"
                })
            }

        }

        let userEmail = await Users.findOne({
            email: request.event.body.email
        })

        if (userEmail) {

            return {
                statusCode: 400,
                body: JSON.stringify({

                    message: "Failed! email is already in use!"
                })
            }

        }




        // might read options
    }


    return {
        // Having descriptive function names will allow for easier tracking of perormance bottlenecks using @middy/core/profiler
        before: verifySignUp,

    }
}







checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username

};



