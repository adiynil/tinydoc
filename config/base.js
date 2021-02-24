module.exports = {
  // 是否开启cors跨域
  cors: true,
  // 设置跨域请求的Origin字段
  origin: "", // https://doc.fateguy.com
  // cookie-session
  sessionOption: (store) => {
    option = {
      secret: "48abbfe819fe4e2384a51a4f7a8623df",
      resave: false,
      saveUninitialized: true,
    };
    if (store) {
      option.store = store;
    }
    return option;
  },
  // cookie-parse
  cookieSignSecret: "48abbfe819fe4e2384a51a4f7a8623df",
};
