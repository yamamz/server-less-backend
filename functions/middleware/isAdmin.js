const Users = require('./../db/models/users')
const defaults = {}
let connection = require('./../db/connection')

module.exports = (opts = {}) => {
    const options = { ...defaults, ...opts }

    const isAdmin = async (request) => {
        await connection()
        try {
            console.log(request.event.userId)
            Users.findOne({ _id: request.event.userId }).then(user => {
                if (user.role === "admin") {
                    return;
                }
                return {
                    statusCode: 401,
                    body: JSON.stringify({

                        message: "Required admin role"
                    })
                }
            });
        } catch (err) {
            return {
                statusCode: 401,
                body: JSON.stringify({

                    message: "Required admin role"
                })
            }
        }
    }


    return {
        // Having descriptive function names will allow for easier tracking of perormance bottlenecks using @middy/core/profiler
        before: isAdmin,

    }
}
