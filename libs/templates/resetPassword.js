const fs = require("fs");
const render = require("../render");

let template = fs
	.readFileSync("./libs/templates/resetPassword.html")
	.toString();

module.exports = (account, newPass) => {
	let data = {
		account,
		newPass,
	};
	return render(template, data);
};
