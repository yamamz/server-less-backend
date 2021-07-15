const mongoose = require('mongoose')

const donationSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
    },

    phone: {
        type: String,
        required: true,
    },
    amount: {
        type: Number
    },
    email: {
        type: String,
        required: true,
        trim: true
    },


}, {
    timestamps: true
})



donationSchema.methods.toJSON = function () {
    return this.toObject()
}

const Donations = mongoose.model('Donations', donationSchema)

module.exports = Donations



