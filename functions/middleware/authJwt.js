const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const defaults = {}

module.exports = (opts = {}) => {
  const options = { ...defaults, ...opts }

  const authToken = async (request) => {

    const authHeader = request.event.headers['authorization']
    let token = authHeader && authHeader.split(' ')[1]


    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({

          message: "No Token provided!"
        })
      }
    }



    try {
      let decoded = jwt.verify(token, 'this is very sectret');
      request.event.userId = decoded.id;
    } catch (err) {
      return {
        statusCode: 401,
        body: JSON.stringify({

          message: "Invalid Token!"
        })
      }
    }




    // might read options
  }


  return {
    // Having descriptive function names will allow for easier tracking of perormance bottlenecks using @middy/core/profiler
    before: authToken,

  }
}





