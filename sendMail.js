const nodemailer = require("nodemailer");
const sendEmail = (email, token) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: "Reset Password",
    html: `<h2>Click the link below to reset your password</h2>
    <p> if you can not be able to click the link below please copy and paste to your browser </p>
    <a href="http://localhost:3000/resetpassword-${token}"> reset password</a>`,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

module.exports = sendEmail;
