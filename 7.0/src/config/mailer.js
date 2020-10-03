const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "eb80698f42ff44",
      pass: "6d9c66f61b6ceb"
    }
})