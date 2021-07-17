const Tickets = require('./db/models/tickets')
var bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
let connection = require('./db/connection')
const middy = require('@middy/core')
const isJwtAuth = require("./middleware/authJwt");
const isAdmin = require('./middleware/isAdmin')
const verifySignUp = require('./middleware/verifySignUp')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const PdfMakePrinter = require('pdfmake/src/printer');
const docDefinitionToPdf = (docDefinition, callback) => {
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
            const result = Buffer.concat(chunks);
            callback(result.toString('base64'));
        });

        pdfDoc.end()

    } catch (err) {
        throw (err);
    }
};

const generatePdf = async (event, context) => {

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        docDefinitionToPdf(event.body.docDefinition, (responsePdf) => {

            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/*",
                },
                body: responsePdf,
                isBase64Encoded: true,
            };

        });

    } catch (err) {
        return {
            statusCode: 500,
            body: err.message
        }
    }
}

exports.handler = middy(generatePdf).use(httpJsonBodyParser()).use(isJwtAuth()).use(isAdmin())