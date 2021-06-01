module.exports = {
	domain: "http://localhost:5000",
	port: 5000,
	cors: true,
	origin: "http://localhost:8080",
	jwt: {
		// 单位s
		defaultExpiresIn: "2h", // 60 * 60
		expiresIn: "3d", // 3 * 24 * 60 * 60
		secretOrKey: "48abbfe819fe4e2384a51a4f7a8623df",
	},
	mail: {
		host: "smtp.exmail.qq.com",
		port: 465,
		user: "info@fateguy.com",
		pass: "hfm58xC2UV7L9biX",
		sender: "TinyDoc",
	},
};
