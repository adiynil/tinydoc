const nodemailer = require("nodemailer");
const nanoid = require("nanoid").customAlphabet(
	"1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
	10
);
const UserModel = require("../models/User");
const jwt = require("./jwt");
const crypto = require("./crypto");

const conf = require("../config/base").mail;

const transporter = nodemailer.createTransport({
	host: conf.host,
	port: conf.port,
	secure: conf.port == 465, // true for 465, false for other ports
	auth: {
		user: conf.user,
		pass: conf.pass,
	},
});
const verify = callback => {
	return transporter.verify(callback);
};
const sendEmailValid = async (account, callback) => {
	try {
		let user = await UserModel.findOne({ account });
		let token = jwt.sign({ account });
		return transporter.sendMail(
			{
				from: `${conf.sender} <${conf.user}>`, // sender address
				to: user.email,
				subject: "请验证你的邮箱账号",
				html: require("./templates/emailValidTemplate")(account, token),
			},
			callback
		);
	} catch (error) {
		return callback ? callback(error) : Promise.reject(error);
	}
};
const sendResetPassword = async (account, callback) => {
	try {
		let newPass = nanoid();
		let { email } = await UserModel.findOne({ account });
		await UserModel.findOneAndUpdate(
			{ account },
			{ password: crypto.encrypt(newPass) }
		);
		return transporter.sendMail(
			{
				from: `${conf.sender} <${conf.user}>`, // sender address
				to: email,
				subject: "重置登陆密码",
				html: require("./templates/resetPassword")(account, newPass),
			},
			callback
		);
	} catch (error) {
		return callback ? callback(error) : Promise.reject(error);
	}
};
const sendFeedback = async data => {
	transporter.sendMail({
		from: `${conf.sender} <${conf.user}>`, // sender address
		to: "adiynil@qq.com",
		subject: "来自TinyDoc的反馈",
		html: `${data.name}<hr>${data.email}<hr>${data.phone}<hr>${data.content}`,
	});
};

module.exports = { sendEmailValid, sendResetPassword, verify, sendFeedback };
// test
// sendEmailValid("adiynil");
// 	.then(() => console.log("send valid success"))
// 	.catch(() => console.log("send valid error"));
// sendResetPassword("adiynil")
// 	.then(() => console.log("send reset success"))
// 	.catch(() => console.log("send reset error"));
