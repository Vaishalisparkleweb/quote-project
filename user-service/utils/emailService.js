const nodemailer = require('nodemailer');
require('dotenv').config();



const sendConfirmationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "kghdevs@gmail.com",
      pass: "gwdwfsokkuizkcyw",
    },
  });
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Registration Successful - Confirm Your Email',
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
              background-color: #f4f4f4;
              padding: 20px;
            }
            .container {
              background-color: #fff;
              padding: 20px;
              border-radius: 5px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            h1 {
              color: #4CAF50;
            }
            .button {
              background-color: #4CAF50;
              color: white;
              padding: 10px 20px;
              border-radius: 5px;
              text-decoration: none;
              font-weight: bold;
            }
            .button:hover {
              background-color: #45a049;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Registration Successful!</h1>
            <p>Thank you for registering with us. To complete your registration, please confirm your email address by clicking the link below:</p>
            <a href="http://localhost:5000/api/confirm/${email}" class="button">Confirm Email</a>
            <p>If you did not create an account, please ignore this email.</p>
            <p>If you have any questions, feel free to contact us at any time.</p>
          </div>
        </body>
      </html>
    `,
  };
  await transporter.sendMail(mailOptions);
};
const sendResetPasswordEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "kghdevs@gmail.com",
      pass: "gwdwfsokkuizkcyw",
    },
  });
  const mailOptions =  {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Password Reset Requested',
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
              background-color: #f4f4f4;
              padding: 20px;
            }
            .container {
              background-color: #fff;
              padding: 20px;
              border-radius: 5px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            h1 {
              color: #FF5733;
            }
            .button {
              background-color: #FF5733;
              color: white;
              padding: 10px 20px;
              border-radius: 5px;
              text-decoration: none;
              font-weight: bold;
            }
            .button:hover {
              background-color: #e64a19;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Password Reset Request</h1>
            <p>We received a request to reset your password. If you made this request, please click the button below to proceed to reset your password:</p>
            <a href="${process.env.BASE_URL}/reset-password" class="button">Reset Password</a>
            <p>If you did not request a password reset, please ignore this email, and your password will remain unchanged.</p>
            <p>For any assistance, feel free to reach out to us at any time.</p>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendConfirmationEmail, sendResetPasswordEmail };
