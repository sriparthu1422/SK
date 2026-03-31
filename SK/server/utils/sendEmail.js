const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_EMAIL || 'user',
      pass: process.env.SMTP_PASSWORD || 'password',
    },
  });

  // Define the email options
  const message = {
    from: `${process.env.FROM_NAME || 'Sri Kanakadhara'} <${process.env.FROM_EMAIL || 'noreply@srikanakadhara.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // If no SMTP credentials are provided, we just log the email to the console for development testing
  if (!process.env.SMTP_EMAIL) {
    console.log('====================================');
    console.log(`[Email Simulation Tool - Dev Mode]`);
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message:\n${options.message}`);
    console.log('====================================');
    return;
  }

  // Send the email
  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
