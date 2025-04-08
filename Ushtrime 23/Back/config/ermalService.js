import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendWelcomeEmail = async (toEmail, name) => {
  try {
    const info = await transporter.sendMail({
      from: `"Travel APP - <${process.env.EMAIL_USER}>"`,
      to: toEmail,
      subject: "Welcome to Our App",
      html: `<h2>Hi, ${name}</h2>
      <p>Welcome aboard! We're thirlled to have you. </p>
      <p>Let us know if you need anything.</p>
      <br>
      <strong> - Travel App Team </strong>
      `,
    });
    console.log("Welcome email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
  }
};
