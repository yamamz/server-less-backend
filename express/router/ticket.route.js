const express = require('express')
const ticketRoute = express.Router()
const { authJwt } = require("../middleware");
const PdfMakePrinter = require('pdfmake/src/printer');
const Tickets = require('./../db/models/tickets')

const makeid = (length) => {
    var result = "";
    var characters = "ABCDEFGHIJKLMNPQRSTUVWXYZ0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}



const generatePdf = (docDefinition, callback) => {
    try {
        var fonts = {
            Roboto: {
                normal: 'fonts/Roboto-Regular.ttf',
                bold: 'fonts/Roboto-Medium.ttf',
                italics: 'fonts/Roboto-Italic.ttf',
                bolditalics: 'fonts/Roboto-MediumItalic.ttf'
            }
        };


        var printer = new PdfMakePrinter(fonts);
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        let chunks = [];

        pdfDoc.on('data', (chunk) => {
            chunks.push(chunk);
        });

        pdfDoc.on('end', () => {
            callback(Buffer.concat(chunks));
        });

        pdfDoc.end()

    } catch (err) {
        throw (err);
    }
};

ticketRoute.post('/generatePdf', (req, res) => {
    try {
        generatePdf(req.body.docDefinition, (responsePdf) => {

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', '"attachment; filename=" + document.pdf');
            console.log('here');
            res.send(responsePdf);
        });

    } catch (err) {
        return res.status(500).send(err.message);
    }

})




ticketRoute.post('/generateOffTicket', [authJwt.verifyToken, authJwt.isAdmin], async (req, res) => {
    try {

        let tickets = [];
        const maxTicketId = await Tickets.countDocuments({}).exec();
        let startId = 0;

        if (maxTicketId) {
            startId = maxTicketId
        }

        for (let i = 1; i <= req.body.ticketPcs; i++) {
            startId++
            tickets.push({
                ticketNumber:
                    makeid(6) +
                    "-" +
                    startId,
                isFree: false,
                user: req.body.userId,
                draw: req.body.drawId,
                isSaleOnline: false,
                soldOut: false,
            });
        }
        await Tickets.insertMany(tickets);
        const ticketsByDraw = await Tickets.find(
            {
                draw: req.body.drawId,

            }
        ).populate({ path: 'user', select: '_id firstName lastName email contact' })
            .populate('draw').exec();
        return res.status(200).json({ tickets: ticketsByDraw });
    } catch (error) {
        return res.status(500).send(error.message);
    }

})
ticketRoute.post('/validate-tickets', [authJwt.verifyToken, authJwt.isAdmin], async (req, res) => {
    try {

        await Tickets.find({ '_id': { $in: req.body } }).updateMany({ $set: { soldOut: false } }).exec();
        res.send({ message: 'success' })
    } catch (error) {
        return res.status(500).send(error.message);
    }

})


ticketRoute.get('/getAll',
    [authJwt.verifyToken, authJwt.isAdmin],
    async (req, res) => {
        try {
            const tickets = await Tickets.find().populate({ path: 'user', select: '_id firstName lastName email contact' })
                .populate('draw')
                .exec();
            console.log(tickets)
            return res.status(200).json({ tickets });
        } catch (error) {
            return res.status(500).send(error.message);
        }
    })

ticketRoute.get('/getAllByDraw/:id', [authJwt.verifyToken, authJwt.isAdmin], async (req, res) => {
    try {


        const { id } = req.params;
        const tickets = await Tickets.find(
            {
                draw: id
            }
        ).populate({ path: 'user', select: '_id firstName lastName email contact' })
            .populate('draw')
            .exec();;
        return res.status(200).json({ tickets });
    } catch (error) {
        return res.status(500).send(error.message);
    }
})

ticketRoute.get('/getAllByUser/:id', [authJwt.verifyToken], async (req, res) => {
    try {
        const { id } = req.params;
        const tickets = await Tickets.find(
            {
                user: id,

            }
        ).populate({ path: 'user', select: '_id firstName lastName email contact' })
            .populate('draw')
            .exec();
        return res.status(200).json({ tickets });
    } catch (error) {
        return res.status(500).send(error.message);
    }
})



ticketRoute.get('/:id', [authJwt.verifyToken, authJwt.isModerator], async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await Tickets.findOne({
            id: id
        });
        if (ticket) {
            return res.status(200).json({ ticket });
        }
        return res.status(404).send('ticket with the specified ID does not exists');
    } catch (error) {
        return res.status(500).send(error.message);
    }
})

ticketRoute.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await Tickets.findOne({
            id: id
        });

        if (ticket) {
            ticket.remove();
            return res.status(204).send("ticket deleted");
        }
        throw new Error("ticket not found");
    } catch (error) {
        return res.status(500).send(error.message);
    }
})

ticketRoute.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Tickets.updateOne({
            id: id
        });
        if (updated) {
            const updatedticket = await Tickets.findOne({ id: id });
            return res.status(200).json({ ticket: updatedticket });
        }
        throw new Error('ticket not found');
    } catch (error) {
        return res.status(500).send(error.message);
    }
})

module.exports = ticketRoute

