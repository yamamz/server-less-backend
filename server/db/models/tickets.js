const mongoose = require('mongoose')

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

ticketSchema.methods.toJSON = function () {
    return this.toObject()
}

const Tickets = mongoose.model('Tickets', ticketSchema)

module.exports = Tickets