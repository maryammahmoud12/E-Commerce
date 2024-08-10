import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.user,
    to: to ? to : "",
    subject: subject ? subject : "hi",
    html: html ? html : "<h2> hello </h2>",
    attachments: [],
  });

  if (info.accepted.length) {
    return true;
  }
  return false;
};
