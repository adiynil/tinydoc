const config = require("../config/base");

module.exports = (req, res, next) => {
  // req.header.origin激进点表示接受所有域名的请求
  res.header("Access-Control-Allow-Origin", req.header.origin);
  // res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length,Authorization,Accept,X-Requested-With"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    // 通过预检之后规定时间内不需要再次预检，单位为秒
    res.header("Access-Control-Max-Age", 60 * 60 * 24);
    // 快速通过预检请求
    res.send(204);
  }
  next();
};
