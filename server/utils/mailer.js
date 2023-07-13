const mailer = require('nodemailer');
const inDev = process.env.INDEVMODE;

module.exports.generateEmail = (userEmail, link) => {
    let config = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    }
    let message = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: 'Anonimosity Verification Email',
        html: `<a>${link}</a>`
    }
    let transporter = mailer.createTransport(config);

    transporter.sendMail(message).then(() => {
        inDev && console.log('Email sent');
        return true;
    }).catch((err) => {
        inDev && console.log('Email error');
        inDev && console.log(err);
        return false;
    })
}