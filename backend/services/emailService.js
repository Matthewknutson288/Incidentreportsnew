const nodemailer = require('nodemailer');

// Email configuration - you'll need to update these with your email settings
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email provider
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS  // your email password or app password
  }
});

const sendWriteUpNotification = async (employeeName, points, writeUpNumber) => {
  try {
    const subject = `${employeeName} - ${writeUpNumber} Write-Up Required`;
    const text = `${employeeName} has reached ${points} points and requires their ${writeUpNumber} write-up.`;
    const html = `
      <h2>Employee Write-Up Required</h2>
      <p><strong>Employee:</strong> ${employeeName}</p>
      <p><strong>Current Points:</strong> ${points}</p>
      <p><strong>Action Required:</strong> ${writeUpNumber} Write-Up</p>
      <p>Please review the incident reports and take appropriate action.</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.MANAGER_EMAIL, // manager's email
      subject: subject,
      text: text,
      html: html
    });

    console.log(`Write-up notification sent for ${employeeName}`);
  } catch (error) {
    console.error('Email notification error:', error);
  }
};

const sendTerminationNotification = async (employeeName, points) => {
  try {
    const subject = `${employeeName} - Termination Required`;
    const text = `${employeeName} has reached ${points} points and should be terminated.`;
    const html = `
      <h2>Employee Termination Required</h2>
      <p><strong>Employee:</strong> ${employeeName}</p>
      <p><strong>Current Points:</strong> ${points}</p>
      <p><strong>Action Required:</strong> Termination</p>
      <p>This employee has exceeded the maximum allowed points.</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.MANAGER_EMAIL,
      subject: subject,
      text: text,
      html: html
    });

    console.log(`Termination notification sent for ${employeeName}`);
  } catch (error) {
    console.error('Email notification error:', error);
  }
};

module.exports = {
  sendWriteUpNotification,
  sendTerminationNotification
}; 