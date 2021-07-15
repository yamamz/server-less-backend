const mongoose = require('mongoose')
const Tickets = require('./tickets');
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
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true }, // So `toObject()` output includes virtuals
    timestamps: true
})

drawSchema.virtual('tickets', {
    ref: 'Tickets',
    localField: '_id',
    foreignField: 'draw'
})

drawSchema.methods.toJSON = function () {
    return this.toObject()
}
drawSchema.pre('remove', async function (next) {
    const draw = this
    await Tickets.remove({ draw: require.draw.id })
    next();
})
const Draws = mongoose.model('Draws', drawSchema)

module.exports = Draws