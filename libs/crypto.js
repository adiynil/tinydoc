const crypto = require('crypto');

const KEY = "751f621ea5c8f930"
const IV = "2624750004598718"

/**
 * 加密方法
 * @param data     需要加密的数据
 * @returns string
 */
exports.encrypt = function(data) {
    var cipher = crypto.createCipheriv('aes-128-cbc', KEY, IV);
    var crypted = cipher.update(data, 'utf8', 'binary');
    crypted += cipher.final('binary');
    crypted = Buffer.from(crypted, 'binary').toString('base64');
    return crypted;
};

/**
 * 解密方法
 * @param crypted  密文
 * @returns string
 */
exports.decrypt = function(crypted) {
    crypted = Buffer.from(crypted, 'base64').toString('binary');
    var decipher = crypto.createDecipheriv('aes-128-cbc', KEY, IV);
    var decoded = decipher.update(crypted, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
};