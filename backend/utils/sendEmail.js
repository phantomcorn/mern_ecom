import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport(
    {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    }
)

transporter.verify(function(error, success) {
    if (error) {
          console.log(`Connection error: ${error}`);
    } else {
          console.log('Server is ready to take your messages');
    }
  });


async function sendEmail(recipient, otp) {
    const mailOptions = {
        from: 'phantomcorn.mern@gmail.com',
        to: recipient,
        subject: "Email Verification",
        text: `Here's your OTP: ${otp}`
      };
      
    // Send the email
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(`Error: ${error}`);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
}


function sendAdminEmail(otp) {
    sendEmail(process.env.ADMIN_EMAIL, otp)
}
export {sendEmail, sendAdminEmail}