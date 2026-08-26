import nodemailer from "nodemailer";

let transporter;

const getTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || "gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });
    }
    return transporter;
};

export const getRiderAppUrl = () => {
    if (process.env.RIDER_APP_URL) return process.env.RIDER_APP_URL.replace(/\/$/, "");
    const frontend = String(process.env.FRONTEND_URL || "http://localhost:5173").split(",")[0].trim().replace(/\/$/, "");
    return `${frontend}/rider.html`;
};

export const sendEmail = async ({ to, subject, text, html }) => {
    const mailer = getTransporter();
    if (!mailer) {
        if (process.env.NODE_ENV !== "production") console.warn(`Email not sent (SMTP not configured): ${subject} -> ${to}`);
        return false;
    }
    await mailer.sendMail({ from: process.env.EMAIL_FROM || process.env.EMAIL_USER, to, subject, text, html });
    return true;
};

