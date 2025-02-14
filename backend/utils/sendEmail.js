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


async function sendEmail(recipient, verificationLink) {
    const mailOptions = {
        from: 'phantomcorn.mern@gmail.com',
        to: recipient,
        subject: "Email Verification",
        text: `Click this link to verify your email account: ${verificationLink}`
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

export default sendEmail
