var nodemailer = require("nodemailer");
var jwt = require("jsonwebtoken");

const EMAIL_USERNAME = "paudelronish@gmail.com";
const PASSWORD = "bbbn";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USERNAME,
    pass: PASSWORD,
  },
});

const token = jwt.sign(
  {
    data: "Token Data",
  },
  "secretKey",
  { expiresIn: "10m" }
);

const mailConfigurations = {
  // It should be a string of sender/server email
  from: "paudelronish@gmail.com",

  to: "tadoha6828@naymedia.com",

  // Subject of Email
  subject: "Email Verification",

  // This would be the text of email body
  text: `Hi! There, You have recently visited
		our website and entered your email.
		Please follow the given link to verify your email
		http://localhost:3000/verify/${token}
		Thanks`,
};

transporter.sendMail(mailConfigurations, function (error, info) {
  if (error) throw Error(error);
  console.log("Email Sent Successfully");
  console.log(info);
});
