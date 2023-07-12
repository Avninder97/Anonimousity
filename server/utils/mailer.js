const mailer = require('nodemailer');

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
        console.log('Email sent');
    }).catch((err) => {
        console.log('Email error');
        console.log(err);
    })
}