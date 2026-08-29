import "../css/compliance.css";

const EFFECTIVE_DATE = "29 August 2026";
const SUPPORT_EMAIL = "support@nutridustfoods.com";
const INFO_EMAIL = "info@nutridustfoods.com";

const pageShell = (title, subtitle, content) => `
    <div class="compliance-page">
        <header class="compliance-header">
            <a class="compliance-brand" href="/" aria-label="NutriDust Foods home">
                <img src="/favicon.svg" alt="" onerror="this.style.display='none'">
                <span>NutriDust Foods</span>
            </a>
            <a class="compliance-home" href="/">Back to shop</a>
        </header>
        <main class="compliance-main">
            <div class="compliance-title">
                <p class="compliance-kicker">NUTRIDUST FOODS</p>
                <h1>${title}</h1>
                <p>${subtitle}</p>
                <small>Effective date: ${EFFECTIVE_DATE}</small>
            </div>
            <article class="compliance-card">${content}</article>
        </main>
        ${ComplianceFooter()}
    </div>
`;

const section = (title, body) => `
    <section>
        <h2>${title}</h2>
        ${body}
    </section>
`;

export function ComplianceFooter() {
    return `
        <footer class="compliance-footer">
            <div>
                <strong>NutriDust Foods</strong>
                <span>Premium nutrition, shopping and delivery services.</span>
            </div>
            <nav aria-label="Legal and support links">
                <a href="/privacy">Privacy</a>
                <a href="/terms">Terms</a>
                <a href="/account-deletion">Delete account</a>
                <a href="/support">Support</a>
            </nav>
            <small>&copy; ${new Date().getFullYear()} NutriDust Foods. All rights reserved.</small>
        </footer>
    `;
}

const privacyPage = () => pageShell(
    "Privacy Policy",
    "How we collect, use, protect and manage personal information across the NutriDust Foods website and apps.",
    [
        section("1. Who this policy covers", `
            <p>This policy applies to customers, rider applicants, approved riders, staff and other people who use the NutriDust Foods website, Shop App, Rider App or Admin App.</p>
        `),
        section("2. Information we collect", `
            <ul>
                <li><strong>Account and contact details:</strong> name, email address, telephone number and login information.</li>
                <li><strong>Orders and delivery:</strong> products ordered, delivery or pickup choice, delivery address, order history and delivery status.</li>
                <li><strong>Payment information:</strong> payment status, amount and transaction reference. Card and bank details are entered with our payment provider and are not stored by NutriDust Foods.</li>
                <li><strong>Rider applications:</strong> names, contact details, vehicle type, plate number, driving licence where applicable, proof of ownership, inspection information and onboarding status.</li>
                <li><strong>Technical information:</strong> device, browser, IP address, diagnostic logs and security events needed to operate and protect the service.</li>
                <li><strong>Communications:</strong> messages and support requests sent to us.</li>
            </ul>
        `),
        section("3. How we use information", `
            <p>We use information to create and secure accounts; process orders and payments; calculate and arrange delivery; provide receipts and order updates; review and onboard riders; assign deliveries; provide customer support; prevent fraud; maintain records; and meet legal obligations.</p>
        `),
        section("4. Services that process information", `
            <p>We use carefully selected providers to operate NutriDust Foods, including hosting, database and file storage, email delivery, notifications and payment processing services. Paystack processes online payments under its own privacy terms. Providers receive only the information needed to perform their services.</p>
        `),
        section("5. Sharing", `
            <p>We do not sell personal information. We may share necessary order and contact details with assigned riders, authorised staff and service providers. We may disclose information where required by law, to protect users, or to investigate fraud and security incidents.</p>
        `),
        section("6. Security and retention", `
            <p>We use access controls, encrypted connections, restricted administrative permissions and other reasonable safeguards. No online system is completely risk-free. We keep information only as long as needed for operations, dispute resolution, fraud prevention and legal or financial record-keeping.</p>
        `),
        section("7. Your choices and rights", `
            <p>You may ask to access, correct or delete your personal information. You can also object to certain uses or withdraw consent where applicable. See our <a href="/account-deletion">Account and Data Deletion page</a> for deletion instructions.</p>
        `),
        section("8. Children", `
            <p>NutriDust Foods services are not directed to children who cannot legally consent to the processing of their personal information. A parent or guardian should contact us if a child has provided information without appropriate permission.</p>
        `),
        section("9. Contact", `
            <p>Privacy questions and requests can be sent to <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.</p>
        `)
    ].join("")
);

const termsPage = () => pageShell(
    "Terms and Conditions",
    "The rules that apply when using NutriDust Foods services.",
    [
        section("1. Acceptance", `<p>By accessing or using NutriDust Foods, you agree to these terms. If you do not agree, do not use the service.</p>`),
        section("2. Accounts", `<p>You must provide accurate information, protect your password and promptly report unauthorised access. You are responsible for activity performed through your account. Staff and rider accounts may be used only by the person to whom they are assigned.</p>`),
        section("3. Products, prices and availability", `<p>Product descriptions, prices and stock may change. An order is accepted only after it is confirmed by our system. We may correct genuine pricing or stock errors and will contact you when an order cannot be fulfilled.</p>`),
        section("4. Orders and payments", `<p>You must provide complete delivery and contact details. Online payments are processed through our payment provider. A successful payment notification does not prevent us from carrying out fraud, stock or delivery checks. Refunds, where approved, are returned using an appropriate available method.</p>`),
        section("5. Delivery and pickup", `<p>Delivery fees and estimates depend on the selected location and service conditions. Delivery times are estimates and can be affected by traffic, weather, access restrictions and events outside our control. Customers must provide a reachable telephone number and a safe, accurate delivery location.</p>`),
        section("6. Rider and staff use", `<p>Rider applications are subject to document review, physical inspection where required and approval. Approval is not guaranteed. NutriDust Foods may suspend or disable rider and staff access for safety, fraud, misconduct, policy breaches or operational reasons.</p>`),
        section("7. Acceptable use", `<p>You must not misuse the service, interfere with its security, impersonate another person, submit false documents, attempt unauthorised access, or use the service for unlawful or harmful activity.</p>`),
        section("8. Service availability", `<p>We work to keep the service available but do not guarantee uninterrupted access. Features may be changed, suspended or withdrawn for maintenance, security, legal or operational reasons.</p>`),
        section("9. Liability", `<p>To the extent permitted by applicable law, NutriDust Foods is not responsible for indirect or consequential losses arising from use of the service. Nothing in these terms excludes rights or liabilities that cannot lawfully be excluded.</p>`),
        section("10. Changes and governing law", `<p>We may update these terms and will publish the effective date. These terms are governed by applicable laws of the Federal Republic of Nigeria.</p>`),
        section("11. Contact", `<p>Questions about these terms can be sent to <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.</p>`)
    ].join("")
);

const deletionPage = () => pageShell(
    "Account and Data Deletion",
    "Request deletion of a NutriDust Foods customer, rider or staff account and associated personal data.",
    [
        section("How to request deletion", `
            <ol>
                <li>Email <a href="mailto:${SUPPORT_EMAIL}?subject=Account%20Deletion%20Request">${SUPPORT_EMAIL}</a> using the email address registered to your account.</li>
                <li>Use the subject <strong>Account Deletion Request</strong>.</li>
                <li>State whether the request concerns a customer, rider or staff account and provide your registered name and telephone number. Do not send your password, payment card information or one-time verification codes.</li>
                <li>We may ask for limited information to verify ownership and protect the account from an unauthorised deletion request.</li>
            </ol>
            <p>You may also use an in-app deletion option if it is available in your account settings.</p>
        `),
        section("What will be deleted", `<p>After verification, we will close the account and delete or anonymise profile details, saved addresses, authentication data and other personal information that is not required for an ongoing transaction or lawful retention.</p>`),
        section("What may be retained", `<p>Completed order, payment, fraud-prevention, safety, rider inspection and financial records may be retained where reasonably necessary for legal obligations, accounting, disputes and security. Retained information is restricted and deleted or anonymised when the applicable need ends.</p>`),
        section("Processing time", `<p>We aim to acknowledge requests promptly and complete verified requests within 30 days, unless additional time is permitted or required by law. We will explain any necessary delay.</p>`),
        section("Deletion without an account", `<p>If you submitted a rider application or contacted support without creating an active account, use the same email process and identify the application or communication you want removed.</p>`)
    ].join("")
);

const supportPage = () => pageShell(
    "Support",
    "Help with orders, payments, accounts, rider onboarding and NutriDust Foods services.",
    [
        section("Customer and account support", `<p>Email <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a> for login problems, payment concerns, refunds, account changes, complaints or technical support.</p>`),
        section("Orders and general enquiries", `<p>Email <a href="mailto:${INFO_EMAIL}">${INFO_EMAIL}</a> for order enquiries, product information and general business questions.</p>`),
        section("Rider onboarding", `<p>Rider applicants should use the Rider App to submit an application. For application or onboarding assistance, contact <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.</p>`),
        section("When contacting us", `<p>Include your name, registered telephone number and order or application number where relevant. Never send a password, one-time verification code, full payment-card number or API key.</p>`),
        section("Security and urgent concerns", `<p>Report suspected account misuse or a safety concern immediately to <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>. For emergencies, contact the appropriate local emergency service.</p>`)
    ].join("")
);

const routes = {
    "/privacy": privacyPage,
    "/privacy-policy": privacyPage,
    "/terms": termsPage,
    "/terms-and-conditions": termsPage,
    "/account-deletion": deletionPage,
    "/delete-account": deletionPage,
    "/support": supportPage
};

export function renderCompliancePage() {
    const path = window.location.pathname.replace(/\/$/, "") || "/";
    const renderer = routes[path.toLowerCase()];

    if (!renderer) return false;

    document.title = `${path.includes("privacy") ? "Privacy Policy" : path.includes("terms") ? "Terms and Conditions" : path.includes("deletion") || path.includes("delete") ? "Account Deletion" : "Support"} | NutriDust Foods`;
    document.querySelector("#app").innerHTML = renderer();
    return true;
}
