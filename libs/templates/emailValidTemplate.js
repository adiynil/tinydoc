const fs = require("fs");
const render = require("../render");

let template = fs
	.readFileSync("./libs/templates/emailValidTemplate.html")
	.toString();

module.exports = (account, token) => {
	let data = {
		account,
		link: "http://localhost:8080/emailvalid?token=" + token,
	};
	return render(template, data);
};
