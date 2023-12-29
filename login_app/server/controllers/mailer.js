import nodemailer from "nodemailer";
import Mailgen from "mailgen";

import ENV from "../config.js";

//ethernal
let nodeConfig = {
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: ENV.EMAIL,
    pass: ENV.PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js",
  },
});

export const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;
  var email = {
    body: {
      name: username,
      intro: text || "Welcome to nodemail",
      outro: "Need to mail. Use Nodemail!",
    },
  };
  var emailBody = MailGenerator.generate(email);
  let message = {
    from: ENV.EMAIL,
    to: userEmail,
    subject: subject || "Signup Successful",
    html: emailBody,
  };

  //send email
  transporter
    .sendMail(message)
    .then(() => {
      return res
        .status(200)
        .send({ msg: "You should receive an email from us." });
    })
    .catch((error) => res.status(500).send(error));
};
