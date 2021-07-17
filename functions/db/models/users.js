
// const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Tickets = require('./tickets')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,

        trim: true
    },
    contact: {
        type: String,

        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

userSchema.virtual('tickets', {
    ref: Tickets,
    localField: '_id',
    foreignField: 'user'
})

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });


module.exports = mongoose.model('Users', userSchema)