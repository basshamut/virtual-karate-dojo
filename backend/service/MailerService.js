const nodemailer = require('nodemailer')
const Utils = require("../utils/Utils");

const MailerService = {}

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 60000,
    greetingTimeout: 60000,
    socketTimeout: 60000
})

MailerService.sendMail = async (to, subject, text, html, adj) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text,
        html: html,
        attachments: adj ? [
            {
                filename: 'invoice.pdf',
                content: adj,
                encoding: 'base64'
            }
        ] : []
    }

    try {
        console.log('Sending email to:', to)
        const mailResponse = await transporter.sendMail(mailOptions)
        console.log('Sending mail response:', mailResponse)
    } catch (error) {
        console.log('Error sending email:', error)
    }
}

MailerService.sendInvoice = function (user, meet, purchaseCreated) {
    const invoiceData = {
        billTo: user.email,
        invoiceNumber: 'ES-' + purchaseCreated.id,
        date: Utils.formatDate(new Date()),
        items: [
            {quantity: 1, description: meet.name, unitPrice: purchaseCreated.price}
        ],
        subtotal: purchaseCreated.price,
        total: purchaseCreated.price
    };

    Utils.createInvoicePDF(invoiceData)
        .then((pdfBase64) => {
            const to = user.email
            const subject = 'Welcome to Mushin Dojo'
            const text = 'Welcome to Mushin Dojo'
            const html = '<h1>Welcome to Mushin Dojo</h1>' +
                '<p>' +
                'Invoice from Mushin Dojo payment :)' +
                '</p>';

            return MailerService.sendMail(to, subject, text, html, pdfBase64);
        })
        .then(() => {
            console.log('Email sent successfully');
        })
        .catch((error) => {
            console.error('Error creating or sending invoice PDF:', error);
        });
}

module.exports = MailerService
