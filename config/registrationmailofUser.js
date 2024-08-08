import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const RegistrationMailOfUser = async (email) => {
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
      subject: "Registration Successful! Welcome to JobHive!",
      text: `Thank you for registering with JobHive. We are excited to have you on board. 
        You can now login to your account and start applying for jobs.
        
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
export default RegistrationMailOfUser;
