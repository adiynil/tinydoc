const User = require("../models/user");
const Connection = require("./Connection");

// sql string
const [DEFAULT_PASSWORD, DEFAULT_GENDER] = ["12345", 1];
const SQL_REGISTER = `insert into user(account,password,email) values(?,?,?)`;
// const insert_multi = `insert into user(name,password,gender) values ?`;
// const delete_force = `delete from user where uid in (?)`;
// const delete_soft = `update user set status=0 where uid in (?)`;
// const select_byid = `select * from user where uid=?`;
// const select_all = `select * from user`;
// const update_byid = `update user set name=?,gender=? where uid=?`;
// const update_password = `update user set password=? where uid=?`;

const MESSAGE = {
  OK: function (rows) {
    return {
      status: 1,
      message: "OK",
      affectedRows: rows,
    };
  },
  SQL_ERROR: function (msg) {
    return {
      status: 0,
      message: msg,
    };
  },
  PASSWORD_INCORRECT: function () {
    return {
      status: 0,
      message: "PASSWORD INCORRECT",
    };
  },
  DATA: function (data) {
    return {
      status: 1,
      message: "OK",
      data: data,
    };
  },
};

/**
 * function accept a Object
 * attribute
 *  required: 'account' 'password' 'email'
 *  optional:
 */
const register = async function (_user) {
  return new Promise((resolve, reject) => {
    let account = _user.account;
    let password = _user.password || DEFAULT_PASSWORD;
    let email = _user.email || DEFAULT_GENDER;
    let val = [account, password, email];
    db.query(SQL_REGISTER, val, (err, res) => {
      if (err) resolve(MESSAGE.SQL_ERROR(err.sqlMessage));
      resolve(MESSAGE.OK(res.affectedRows));
    });
  });
};

/**
 * function accept a Array of Objects
 * Object attribute
 *  required: 'name'
 *  optional: 'password' 'gender'
 */
const insertSome = async function (_users) {
  return new Promise((resolve, reject) => {
    let vals = [];
    _users.forEach((user) => {
      let name = user.name;
      let password = user.password || DEFAULT_PASSWORD;
      let gender = user.gender || DEFAULT_GENDER;
      let val = [name, password, gender];
      vals.push(val);
    });
    db.query(SQL_INSERT_MULTI, [vals], (err, res) => {
      if (err) resolve(MESSAGE.SQL_ERROR(err.sqlMessage));
      resolve(MESSAGE.OK(res.affectedRows));
    });
  });
};

/**
 * function accept a Number or a Array of Numbers
 */
const deleteById = async function (...id) {
  return new Promise((resolve, reject) => {
    let vals = [...id];
    db.query(SQL_DELETE_SOFT, vals, (err, res) => {
      if (err) resolve(MESSAGE.SQL_ERROR(err.sqlMessage));
      resolve(MESSAGE.OK(res.affectedRows));
    });
  });
};

/**
 * function accept a Number or a Array of Numbers
 */
const forceDelete = async function (...id) {
  return new Promise((resolve, reject) => {
    let vals = [...id];
    db.query(SQL_DELETE_FORCE, vals, (err, res) => {
      if (err) resolve(MESSAGE.SQL_ERROR(err.sqlMessage));
      resolve(MESSAGE.OK(res.affectedRows));
    });
  });
};

/**
 * function accept a Object
 * attribute
 *  required: 'uid' 'name' 'gender'
 */
const updateById = async function (_user) {
  return new Promise((resolve, reject) => {
    let name = _user.name;
    let gender = _user.gender;
    let id = _user.id;
    let val = [name, gender, id];
    db.query(SQL_UPDATE_BYID, val, (err, res) => {
      if (err) resolve(MESSAGE.SQL_ERROR(err.sqlMessage));
      resolve(MESSAGE.OK(res.affectedRows));
    });
  });
};

/**
 * function accept a Number
 * return a User Object
 */
const findById = async function (_id) {
  return new Promise((resolve, reject) => {
    let val = [_id];
    db.query(SQL_SELECT_BYID, val, (err, res) => {
      if (err) resolve(MESSAGE.SQL_ERROR(err.sqlMessage));
      resolve(MESSAGE.DATA(res));
    });
  });
};

/**
 * function
 * return a Array of User Objects
 */
const findAll = async function () {
  return new Promise((resolve, reject) => {
    db.query(SQL_SELECT_ALL, (err, res) => {
      if (err) resolve(MESSAGE.SQL_ERROR(err.sqlMessage));
      resolve(MESSAGE.DATA(res));
    });
  });
};

/**
 * function accept a User Object and a new Password
 */
const changePassword = async function (_user, _nPassword) {
  return new Promise(async (resolve, reject) => {
    let target = await findById(_user.id);
    let oPassword = target.data[0].password;
    if (oPassword != _user.password) resolve(MESSAGE.PASSWORD_INCORRECT);
    let val = [_nPassword, _user.id];
    db.query(SQL_UPDATE_PASSWORD, val, (err, res) => {
      if (err) resolve(MESSAGE.SQL_ERROR(err.sqlMessage));
      resolve(MESSAGE.OK(res.affectedRows));
    });
  });
};

module.exports = {
  insertOne,
  insertSome,
  deleteById,
  forceDelete,
  findById,
  findAll,
  updateById,
  changePassword,
};
