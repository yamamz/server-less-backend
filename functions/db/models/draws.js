const mongoose = require('mongoose')
const Tickets = require('./tickets')
const drawSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    startPeriodDate: {
        type: Date,
        required: true,
    },

    drawDate: {
        type: Date,
        required: true,
    },
    ticketPrice: {
        type: Number
    },
    licence: {
        type: String,
        required: true,
        trim: true
    },
    numberOfTickets: {
        type: Number
    },
    active: { type: Boolean, default: false }

}, {
    timestamps: true
})

drawSchema.virtual('tickets', {
    ref: Tickets,
    localField: '_id',
    foreignField: 'draw'
})

drawSchema.set('toObject', { virtuals: true });
drawSchema.set('toJSON', { virtuals: true });


module.exports = mongoose.model('Draws', drawSchema)