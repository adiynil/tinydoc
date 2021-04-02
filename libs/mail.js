const nodemailer = require("nodemailer");
const conf = require("../config/base").mail;

module.exports = async function main(option) {
    let transporter = nodemailer.createTransport({
        host: conf.host,
        port: conf.port,
        secure: conf.port == 465, // true for 465, false for other ports
        auth: {
            user: conf.user,
            pass: conf.pass,
        },
    });

    let info = await transporter.sendMail({
        from: `${conf.sender} <${conf.user}>`, // sender address
        to: option.to,
        subject: option.subject,
        html: option.html,
        text: option.text ? option.text : "",
    });
    // console.log(info);
};