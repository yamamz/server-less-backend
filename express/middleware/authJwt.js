const jwt = require("jsonwebtoken");
const config = require("./../config/auth.config");
const Users = require('./../db/models/users')

verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  let token = authHeader && authHeader.split(' ')[1]
  console.log(token)

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  try {
    console.log(req.userId)
    Users.findOne({ _id: req.userId }).then(user => {
      if (user.role === "admin") {
        next();
        return;
      }
      res.status(403).send({
        message: "Require Admin Role!"
      });
      return;

    });
  } catch (err) {
    res.status(403).send({
      message: "Require Admin Role!"
    });
  }
};

isModerator = (req, res, next) => {
  try {
    Users.findOne({ _id: req.userId }).then(user => {
      if (user.role === "moderator") {
        next();
        return;
      }
      res.status(403).send({
        message: "Require Moderator Role!"
      });
      return;

    });
  } catch (err) {
    res.status(403).send({
      message: err.message
    });
    return;
  }

};

isModeratorOrAdmin = (req, res, next) => {
  Users.findOne({ _id: req.userId }).then(user => {
    if (user.role === "admin" || user.role === "moderator") {
      next();
      return;
    }
    res.status(403).send({
      message: "Require Admin or Moderator Role!"
    });
    return;

  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin
};
module.exports = authJwt;