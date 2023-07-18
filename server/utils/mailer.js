const mailer = require('nodemailer');
const inDev = process.env.INDEVMODE;

/*
    Used to send emails to new user to verify their email address
*/
module.exports.generateEmail = async (userEmail, link) => {
    try {
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
        inDev && console.log("Email - ", userEmail);
        const res = await transporter.sendMail(message);
        inDev && console.log(res);
        return true;
    } catch(err) {
        inDev && console.log('Email error');
        inDev && console.log(err);
        return false;
    }
}