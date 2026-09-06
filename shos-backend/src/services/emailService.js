// SHOS Email Service — Powered by Nodemailer
// Uses Gmail SMTP with SSL (port 465)

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: true, // SSL for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify SMTP connection on startup
transporter.verify((err) => {
  if (err) {
    console.warn('[EmailService] SMTP connection not available:', err.message);
  } else {
    console.log('[EmailService] SMTP ready →', process.env.SMTP_USER);
  }
});

// ─── OTP Email ──────────────────────────────────────────────

export const sendOtpEmail = async (to, otp, name = 'User') => {
  return transporter.sendMail({
    from: `"SHOS Hospital System" <${process.env.SMTP_FROM}>`,
    to,
    subject: `${otp} — Your SHOS Verification Code`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
        <div style="background:#1565C0;padding:20px 24px;">
          <h2 style="color:#fff;margin:0;font-size:20px;">🏥 SHOS — Smart Hospital Operations</h2>
        </div>
        <div style="padding:28px 24px;">
          <p style="font-size:15px;color:#333;">Dear <strong>${name}</strong>,</p>
          <p style="font-size:15px;color:#555;">Your one-time verification code is:</p>
          <div style="text-align:center;margin:24px 0;">
            <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#1565C0;">${otp}</span>
          </div>
          <p style="font-size:13px;color:#888;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
          <p style="font-size:12px;color:#aaa;">If you did not request this, please ignore this email or contact SHOS support.</p>
        </div>
      </div>
    `,
  });
};

// ─── Password Reset Email ─────────────────────────────────

export const sendPasswordResetEmail = async (to, resetLink, name = 'User') => {
  return transporter.sendMail({
    from: `"SHOS Hospital System" <${process.env.SMTP_FROM}>`,
    to,
    subject: 'Reset Your SHOS Password',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
        <div style="background:#1565C0;padding:20px 24px;">
          <h2 style="color:#fff;margin:0;font-size:20px;">🏥 SHOS — Password Reset</h2>
        </div>
        <div style="padding:28px 24px;">
          <p style="font-size:15px;color:#333;">Dear <strong>${name}</strong>,</p>
          <p style="font-size:15px;color:#555;">Click the button below to reset your password. This link is valid for <strong>30 minutes</strong>.</p>
          <div style="text-align:center;margin:28px 0;">
            <a href="${resetLink}" style="background:#1565C0;color:#fff;padding:12px 32px;border-radius:6px;text-decoration:none;font-size:15px;font-weight:600;">Reset Password</a>
          </div>
          <p style="font-size:13px;color:#888;">If you did not request a password reset, please ignore this email.</p>
        </div>
      </div>
    `,
  });
};

// ─── Appointment Confirmation Email ──────────────────────

export const sendAppointmentConfirmationEmail = async (to, appointment, name = 'Patient') => {
  return transporter.sendMail({
    from: `"SHOS Hospital System" <${process.env.SMTP_FROM}>`,
    to,
    subject: `Appointment Confirmed — Token #${appointment.tokenNumber}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
        <div style="background:#00796B;padding:20px 24px;">
          <h2 style="color:#fff;margin:0;font-size:20px;">✅ Appointment Confirmed</h2>
        </div>
        <div style="padding:28px 24px;">
          <p style="font-size:15px;color:#333;">Dear <strong>${name}</strong>,</p>
          <p style="font-size:15px;color:#555;">Your appointment has been confirmed:</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr><td style="padding:8px;color:#666;font-size:13px;">Doctor</td><td style="padding:8px;font-weight:600;font-size:13px;">${appointment.doctorName}</td></tr>
            <tr style="background:#f9f9f9;"><td style="padding:8px;color:#666;font-size:13px;">Department</td><td style="padding:8px;font-size:13px;">${appointment.department}</td></tr>
            <tr><td style="padding:8px;color:#666;font-size:13px;">Date</td><td style="padding:8px;font-size:13px;">${appointment.date}</td></tr>
            <tr style="background:#f9f9f9;"><td style="padding:8px;color:#666;font-size:13px;">Time Slot</td><td style="padding:8px;font-size:13px;">${appointment.timeSlot}</td></tr>
            <tr><td style="padding:8px;color:#666;font-size:13px;">Token Number</td><td style="padding:8px;font-size:24px;font-weight:700;color:#1565C0;">#${appointment.tokenNumber}</td></tr>
          </table>
          <p style="font-size:12px;color:#aaa;">Please arrive 15 minutes before your slot. Carry a valid photo ID and your UHID card.</p>
        </div>
      </div>
    `,
  });
};

// ─── Generic Alert Email ──────────────────────────────────

export const sendAlertEmail = async (to, subject, message) => {
  return transporter.sendMail({
    from: `"SHOS Alerts" <${process.env.SMTP_FROM}>`,
    to,
    subject,
    html: `<div style="font-family:Arial,sans-serif;padding:24px;"><p>${message}</p></div>`,
  });
};

export default {
  sendOtpEmail,
  sendPasswordResetEmail,
  sendAppointmentConfirmationEmail,
  sendAlertEmail,
};
