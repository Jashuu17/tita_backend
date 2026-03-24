// services/emailService.js
// Sends emails via Nodemailer using Gmail
// Setup: npm install nodemailer
// In .env add:
//   EMAIL_USER=your.gmail@gmail.com
//   EMAIL_PASS=your_app_password   ← Gmail App Password (not your login password)
//   APP_NAME=TITA

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,   // Gmail App Password
  },
});

const APP_NAME = process.env.APP_NAME || 'TITA';
const PRIMARY  = '#000000';

// ── Welcome / Registration email ─────────────────────────────────────────
async function sendWelcomeEmail({ to, name, password }) {
  const html = `
  <!DOCTYPE html>
  <html>
  <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
      <tr><td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr><td style="background:${PRIMARY};padding:36px 40px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:28px;letter-spacing:4px;">${APP_NAME}</h1>
            <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:13px;">Timetable & Device Manager</p>
          </td></tr>

          <!-- Body -->
          <tr><td style="padding:40px;">
            <h2 style="color:#111;margin:0 0 8px;font-size:22px;">Welcome, ${name}! 👋</h2>
            <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 28px;">
              Your account has been created successfully. Here are your login credentials:
            </p>

            <!-- Credentials box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;border-radius:12px;margin-bottom:28px;">
              <tr><td style="padding:24px;">
                <p style="margin:0 0 14px;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Your Credentials</p>
                <table width="100%">
                  <tr>
                    <td style="padding:8px 0;color:#666;font-size:14px;width:90px;">Email</td>
                    <td style="padding:8px 0;color:#111;font-size:14px;font-weight:600;">${to}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:#666;font-size:14px;">Password</td>
                    <td style="padding:8px 0;color:#111;font-size:14px;font-weight:600;letter-spacing:1px;">${password}</td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 28px;">
              Please log in to the <strong>${APP_NAME}</strong> app and change your password after your first login.
            </p>

            <!-- Security notice -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8e1;border-left:4px solid #ffc107;border-radius:0 8px 8px 0;margin-bottom:28px;">
              <tr><td style="padding:16px 20px;">
                <p style="margin:0;color:#856404;font-size:13px;line-height:1.5;">
                  🔒 <strong>Security tip:</strong> Do not share your password with anyone. 
                  ${APP_NAME} staff will never ask for your password.
                </p>
              </td></tr>
            </table>

          </td></tr>

          <!-- Footer -->
          <tr><td style="background:#f8f8f8;padding:24px 40px;text-align:center;border-top:1px solid #eee;">
            <p style="margin:0;color:#aaa;font-size:12px;">
              This is an automated message from ${APP_NAME}. Please do not reply to this email.
            </p>
          </td></tr>

        </table>
      </td></tr>
    </table>
  </body>
  </html>`;

  await transporter.sendMail({
    from:    `"${APP_NAME}" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Welcome to ${APP_NAME} — Your Account is Ready`,
    html,
  });

  console.log(`[Email] Welcome email sent to ${to}`);
}

// ── Device assigned email ─────────────────────────────────────────────────
async function sendDeviceAssignedEmail({ to, name, deviceName, deviceId }) {
  const html = `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
      <tr><td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          <tr><td style="background:${PRIMARY};padding:36px 40px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:28px;letter-spacing:4px;">${APP_NAME}</h1>
          </td></tr>
          <tr><td style="padding:40px;">
            <h2 style="color:#111;margin:0 0 8px;">Device Assigned 📟</h2>
            <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 24px;">
              Hi ${name}, you have been assigned to a new device:
            </p>
            <table width="100%" style="background:#f8f8f8;border-radius:12px;margin-bottom:24px;">
              <tr><td style="padding:24px;">
                <table width="100%">
                  <tr>
                    <td style="color:#666;font-size:14px;width:100px;padding:6px 0;">Device Name</td>
                    <td style="color:#111;font-size:14px;font-weight:600;padding:6px 0;">${deviceName}</td>
                  </tr>
                  <tr>
                    <td style="color:#666;font-size:14px;padding:6px 0;">Device ID</td>
                    <td style="color:#111;font-size:13px;font-family:monospace;padding:6px 0;">${deviceId}</td>
                  </tr>
                </table>
              </td></tr>
            </table>
            <p style="color:#555;font-size:14px;">Open the ${APP_NAME} app to view the timetable for this device.</p>
          </td></tr>
          <tr><td style="background:#f8f8f8;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
            <p style="margin:0;color:#aaa;font-size:12px;">Automated message from ${APP_NAME}</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
  </html>`;

  await transporter.sendMail({
    from:    `"${APP_NAME}" <${process.env.EMAIL_USER}>`,
    to,
    subject: `${APP_NAME} — You've been assigned to ${deviceName}`,
    html,
  });

  console.log(`[Email] Device assigned email sent to ${to}`);
}

module.exports = { sendWelcomeEmail, sendDeviceAssignedEmail };