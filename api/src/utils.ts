import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (
  email: string,
  subject: string,
  message: string
) => {
  transport.sendMail({
    from: "no-reply@twitee.com",
    to: email,
    subject,
    text: message,
  });
};
