const mongoose = require('mongoose')
require('./users')
require('./draws')
const ticketSchema = new mongoose.Schema({
    ticketNumber: {
        type: String,
        required: true,
        unique: true
    },
    isFree: { type: Boolean, required: true, default: false },
    isSaleOnline: { type: Boolean, required: true, default: true },
    soldOut: { type: Boolean, required: true, default: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    draw: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Draws'
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Tickets', ticketSchema)