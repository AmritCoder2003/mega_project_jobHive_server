import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const mailSender = async (email, link) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });
        console.log("email is: " + process.env.MAIL_USER);
        let mailOptions = await transporter.sendMail({
          from: `${process.env.APP_NAME}`,
          to: `${email}`,
          subject: "Password Reset Link JobHive",
          text: `Forgot Your Password? \n\n Don't worry, it happens to the best of us! Click the button below to reset your password.
          If you didn't request this, you can ignore this email.'  + ${link},
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
    }
    catch (err) {
        console.log(err.message);
    }
}
export default mailSender;