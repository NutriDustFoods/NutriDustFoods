import test from "node:test";
import assert from "node:assert/strict";
import { sendEmail } from "../services/emailService.js";

test("production email uses the Resend HTTPS API", async () => {
    const originalFetch = global.fetch;
    const originalKey = process.env.RESEND_API_KEY;
    const originalFrom = process.env.EMAIL_FROM;
    let request;
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.EMAIL_FROM = "NutriDust Foods <support@nutridustfoods.com>";
    global.fetch = async (url, options) => {
        request = { url, options };
        return new Response(JSON.stringify({ id: "email_123" }), { status: 200 });
    };
    try {
        const sent = await sendEmail({
            to: "rider@example.com",
            subject: "Rider approved",
            text: "Approved",
            html: "<p>Approved</p>"
        });
        assert.equal(sent, true);
        assert.equal(request.url, "https://api.resend.com/emails");
        assert.equal(request.options.headers.Authorization, "Bearer re_test_key");
        const body = JSON.parse(request.options.body);
        assert.equal(body.from, "NutriDust Foods <support@nutridustfoods.com>");
        assert.deepEqual(body.to, ["rider@example.com"]);
    } finally {
        global.fetch = originalFetch;
        if (originalKey === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = originalKey;
        if (originalFrom === undefined) delete process.env.EMAIL_FROM; else process.env.EMAIL_FROM = originalFrom;
    }
});

test("email reports not sent when neither HTTPS nor SMTP is configured", async () => {
    const saved = {
        key: process.env.RESEND_API_KEY,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    };
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASS;
    try {
        assert.equal(await sendEmail({ to:"rider@example.com", subject:"Test", text:"Test" }), false);
    } finally {
        if (saved.key !== undefined) process.env.RESEND_API_KEY = saved.key;
        if (saved.user !== undefined) process.env.EMAIL_USER = saved.user;
        if (saved.pass !== undefined) process.env.EMAIL_PASS = saved.pass;
    }
});
