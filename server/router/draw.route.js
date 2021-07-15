const express = require('express')
const drawRoute = express.Router()
const { authJwt } = require("../middleware");
const Draws = require('./../db/models/draws')
drawRoute.post('/new', [authJwt.verifyToken, authJwt.isAdmin], async (req, res) => {
    try {
        let draw = Draws({
            description: req.body.description,
            startPeriodDate: req.body.startPeriodDate,
            drawDate: req.body.drawDate,
            ticketPrice: req.body.ticketPrice,
            licence: req.body.licence,
            numberOfTickets: req.body.numberOfTickets,
        })
        await draw.save()
        res.send(draw)
    } catch (error) {
        return res.status(500).send(error.message);
    }
})

drawRoute.get('/getAll', [authJwt.verifyToken], async (req, res) => {
    try {
        const draws = await Draws.find({}).populate('tickets')
            .exec();
        console.log(draws)
        return res.status(200).json({ draws });
    } catch (error) {
        return res.status(500).send(error.message);
    }
})



drawRoute.get('/:id', [authJwt.verifyToken, authJwt.isAdmin], async (req, res) => {
    try {
        const { id } = req.params;
        const draw = await db.Draws.findOne({
            where: { id: id },
            include: [
                {
                    model: db.Tickets,
                }
            ]
        });
        if (draw) {
            return res.status(200).json({ draw });
        }
        return res.status(404).send('draw with the specified ID does not exists');
    } catch (error) {
        return res.status(500).send(error.message);
    }
})

// drawRoute.delete('/:id', [authJwt.verifyToken, authJwt.admin], async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deleted = await db.Draws.destroy({
//             where: { id: id }
//         });
//         if (deleted) {
//             return res.status(204).send("draw deleted");
//         }
//         throw new Error("draw not found");
//     } catch (error) {
//         return res.status(500).send(error.message);
//     }
// })

drawRoute.put('/:id', [authJwt.verifyToken, authJwt.isAdmin], async (req, res) => {
    try {
        const { id } = req.params;

        const draw = await Draws.findOneAndUpdate({ _id: id }, req.body, { new: true });
        if (draw) {

            return res.status(200).json({ draw: draw });
        } else {
            return res.status(500).send(error.message);
        }


    } catch (error) {
        return res.status(500).send(error.message);
    }
})

module.exports = drawRoute

