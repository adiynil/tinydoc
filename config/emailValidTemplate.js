exports.subject = "请验证你的邮箱账号";

exports.html = (account, token) => {
    return `<p>您正在申请将您当前的邮箱账号与账号${account}进行绑定，
                如果确认是您在操作，请在1个小时之内点击下方链接进行验证，
                如果不是，请忽略这封邮件。</p><hr>
                <a href="http://localhost:5000/user/active?token=${token}">http://localhost:5000/user/active?token=${token}</a>`;
};