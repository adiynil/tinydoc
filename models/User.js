var mongoose = require("mongoose");

mongoose.connect("mongodb://198.55.96.47/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on("error", (err) => {
  if (err) {
    console.log("connection error:");
  }
});
db.once("open", function () {
  console.log("connect success");
});

class User {
  constructor(_user) {
    for (const key in _user) {
      if (_user.hasOwnProperty(key)) {
        this[key] = _user[key];
      }
    }
  }
  UserId;
  RealName;
  Account;
  Password;
  // 用户性别： 0女性 / 1男性
  Gender;
  Email;
  Phone;
  Avatar;
  Description;
  // 用户状态： 0封禁 / 1正常
  Status;
  // 角色类别：0超级管理员 / 1管理员 / 2普通用户
  Role;
  RoleName;
  CreateAt;
  LastLogin;
  // 是否公开电话：0关闭 / 1开启
  isPhonePublic;
  // 是否公开Email：0关闭 / 1开启
  isEmailPublic;
  // 是否开启Email登录：0关闭 / 1开启
  isUseEmailLogin;
  // 是否开启电话登录：0关闭 / 1开启
  isUsePhoneLogin;
  // 是否开启站内信：0关闭 / 1开启
  isRecieveMesssage;
}

module.exports = {};
