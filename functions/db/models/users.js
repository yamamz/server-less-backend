const mongoose = require('mongoose')
// const validator = require('validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Tickets = require('./tickets');
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
        // validate(value) {
        //     if (!validator.isEmail(value)) {
        //         throw new Error('Email is invalid')
        //     }
        // },
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
    ref: 'Tickets',
    localField: '_id',
    foreignField: 'user'
})

userSchema.methods.toJSON = function () {
    const user = this.toObject()
    delete user.password
    delete user.tokens
    return user;
}

userSchema.statics.findByCredentials = async (email, password) => {
    try {
        const user = await Users.findOne({ email })
        if (!user)
            throw new Error()
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch)
            throw new Error()
        return user;
    } catch (e) {
        return "Unable to login"
    }
}

userSchema.statics.findByUserUsername = async (username) => {
    try {
        const user = await Users.findOne({ username: username })
        if (!user)
            throw new Error()
        return user;
    } catch (e) {
        return "Username not found"
    }
}

// userSchema.pre('save', async function (next) {
//     const user = this
//     if (user.isModified('password')) {
//         user.password = await bcrypt.hash(user.password, 8);
//     }
//     next();
// })

userSchema.pre('remove', async function (next) {
    const user = this
    await Tickets.remove({ user: require.user.id })
    next();
})
const Users = mongoose.model('Users', userSchema)

module.exports = Users