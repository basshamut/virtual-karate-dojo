const nodemailer = require('nodemailer')

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

MailerService.sendMail = async (to, subject, text, html) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text,
        html: html
    }

    try {
        console.log('Sending email to:', to)
        const mailResponse = await transporter.sendMail(mailOptions)
        console.log('Sendind mail response:', mailResponse)
    }   catch (error) {
        console.log('Error sending email:', error)
    }
}

module.exports = MailerService
