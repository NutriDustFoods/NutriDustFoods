import nodemailer from "nodemailer";

let transporter;

const defaultFrom = "NutriDust Foods <support@nutridustfoods.com>";

const sendWithResend = async ({ to, subject, text, html }) => {
    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            from: process.env.EMAIL_FROM || defaultFrom,
            to: [to],
            subject,
            text,
            html,
            ...(process.env.EMAIL_REPLY_TO ? { reply_to: process.env.EMAIL_REPLY_TO } : {})
        })
    });
    if (!response.ok) {
        const details = await response.text();
        throw new Error(`Resend email failed (${response.status}): ${details}`);
    }
};

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
    if (process.env.RESEND_API_KEY) {
        await sendWithResend({ to, subject, text, html });
        return true;
    }
    const mailer = getTransporter();
    if (!mailer) {
        console.warn(`Email not sent (RESEND_API_KEY or SMTP credentials are not configured): ${subject} -> ${to}`);
        return false;
    }
    await mailer.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        replyTo: process.env.EMAIL_REPLY_TO || undefined,
        to,
        subject,
        text,
        html
    });
    return true;
};
