module.exports = (req, res, next) => {
  if (req.session.auth) {
    next();
  } else {
    flag = false;
    // 验证req传来的账号密码
    if (flag) {
      req.session.auth = "account";
      next();
    } else {
      res.status(403).send();
    }
  }
};
/**
    req.session.auth = value
    req.session.auth
    req.session.sessionOptions.maxAge = 3*24*60*60*1000 // 单位是ms
    req.session = null
 */
