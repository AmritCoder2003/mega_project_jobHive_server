import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const EmailVerification = async (email, otp , name) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    console.log("email is: " + process.env.MAIL_USER);
    let mailOptions = await transporter.sendMail({
      from: `${process.env.APP_NAME}`,
      to: `${email}`,
      subject: "Email Verification JobHive",
      text: `Hi ${name}, You're almost set to start enjoying ${process.env.APP_NAME}.
      Simply type the otp to verify your email address and get started. 
      The otp expires in 2 minutes.  ${otp},
            `,
    });
    
    console.log(mailOptions);
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.log(err.message);
  }
};
export default EmailVerification;
