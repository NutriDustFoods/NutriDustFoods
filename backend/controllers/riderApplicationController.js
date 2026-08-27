import bcrypt from "bcryptjs";
import crypto from "crypto";
import db from "../config/sqlite.js";
import { getRiderAppUrl, sendEmail } from "../services/emailService.js";
import { getRiderDocumentAccess, uploadRiderDocument } from "../services/riderDocumentStorageService.js";

const hashToken = token => crypto.createHash("sha256").update(token).digest("hex");
const token = () => crypto.randomBytes(32).toString("hex");
const cleanEmail = value => String(value || "").trim().toLowerCase();
const cleanPhone = value => String(value || "").replace(/\s+/g, "").trim();
const applicationView = row => ({
    id: row.id, trackingCode: row.tracking_code, firstName: row.first_name, middleName: row.middle_name,
    surname: row.surname, fullName: [row.first_name, row.middle_name, row.surname].filter(Boolean).join(" "),
    phone: row.phone, email: row.email, vehicleType: row.vehicle_type, plateNumber: row.plate_number,
    emailVerified: Boolean(row.email_verified_at), applicationStatus: row.application_status,
    inspectionStatus: row.inspection_status, inspectionNotes: row.inspection_notes,
    reviewedBy: row.reviewed_by, reviewedAt: row.reviewed_at, riderId: row.rider_id, createdAt: row.created_at
});

export const submitRiderApplication = async (req, res) => {
    const { firstName, middleName, surname, phone, email, plateNumber, vehicleType = "Motorcycle" } = req.body || {};
    const normalizedEmail = cleanEmail(email), normalizedPhone = cleanPhone(phone);
    if (!firstName || !surname || !normalizedPhone || !normalizedEmail || !plateNumber) return res.status(400).json({ success:false, message:"First name, surname, phone, email and plate number are required." });
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) return res.status(400).json({ success:false, message:"Enter a valid email address." });
    if (!req.files?.ownershipDocument?.[0]) return res.status(400).json({ success:false, message:"Proof of vehicle ownership is required." });
    const duplicate = db.prepare("SELECT 1 FROM rider_applications WHERE phone=? OR email=? UNION SELECT 1 FROM riders WHERE phone=? OR lower(email)=?").get(normalizedPhone, normalizedEmail, normalizedPhone, normalizedEmail);
    if (duplicate) return res.status(409).json({ success:false, message:"This phone number or email already has a rider registration." });

    try {
        const trackingCode = `NDR-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
        const key = `${normalizedPhone}-${trackingCode}`;
        const ownershipPath = await uploadRiderDocument(req.files.ownershipDocument[0], key, "ownership");
        const licensePath = await uploadRiderDocument(req.files.drivingLicense?.[0], key, "license");
        const result = db.prepare(`INSERT INTO rider_applications
            (tracking_code,first_name,middle_name,surname,phone,email,vehicle_type,plate_number,driving_license_path,ownership_document_path,application_status)
            VALUES(?,?,?,?,?,?,?,?,?,?,'pending_review')`).run(
                trackingCode, String(firstName).trim(), middleName ? String(middleName).trim() : null, String(surname).trim(),
                normalizedPhone, normalizedEmail, String(vehicleType).trim(), String(plateNumber).trim().toUpperCase(), licensePath, ownershipPath
            );
        return res.status(201).json({ success:true, message:"Application received. NutriDust will review your details and documents.", trackingCode, applicationId:Number(result.lastInsertRowid) });
    } catch (error) {
        return res.status(500).json({ success:false, message:error.message || "Unable to submit rider application." });
    }
};

export const verifyRiderApplicationEmail = (req, res) => {
    const hashed = hashToken(String(req.body?.token || ""));
    const row = db.prepare("SELECT * FROM rider_applications WHERE email_verification_token_hash=? AND email_verification_expires_at>CURRENT_TIMESTAMP").get(hashed);
    if (!row) return res.status(400).json({ success:false, message:"This verification link is invalid or expired." });
    db.prepare("UPDATE rider_applications SET email_verified_at=COALESCE(email_verified_at,CURRENT_TIMESTAMP),application_status=CASE WHEN application_status='pending_email' THEN 'pending_review' ELSE application_status END,email_verification_token_hash=NULL,email_verification_expires_at=NULL,updated_at=CURRENT_TIMESTAMP WHERE id=?").run(row.id);
    return res.json({ success:true, message:"Email verified. Your application is ready for admin review.", trackingCode:row.tracking_code });
};

export const getRiderApplicationStatus = (req, res) => {
    const row = db.prepare("SELECT * FROM rider_applications WHERE tracking_code=?").get(String(req.params.trackingCode || "").trim().toUpperCase());
    return row ? res.json({ success:true, application:applicationView(row) }) : res.status(404).json({ success:false, message:"Application not found." });
};

export const listRiderApplications = (req, res) => {
    const rows = db.prepare("SELECT * FROM rider_applications ORDER BY CASE application_status WHEN 'pending_review' THEN 0 WHEN 'pending_email' THEN 1 ELSE 2 END,id DESC").all();
    return res.json({ success:true, applications:rows.map(applicationView) });
};

export const getRiderApplication = async (req, res) => {
    const row = db.prepare("SELECT * FROM rider_applications WHERE id=?").get(Number(req.params.id));
    if (!row) return res.status(404).json({ success:false, message:"Application not found." });
    let ownership=null,license=null,documentWarning=null;
    try { ownership=await getRiderDocumentAccess(row.ownership_document_path); } catch(error) { documentWarning=error.message; }
    try { license=await getRiderDocumentAccess(row.driving_license_path); } catch(error) { documentWarning=documentWarning||error.message; }
    return res.json({ success:true, application:{ ...applicationView(row), ownershipDocumentUrl:ownership?.signedUrl || null, drivingLicenseUrl:license?.signedUrl || null, localOwnership:Boolean(ownership?.filePath), localLicense:Boolean(license?.filePath), documentWarning } });
};

export const streamLocalRiderDocument = async (req, res) => {
    const row = db.prepare("SELECT * FROM rider_applications WHERE id=?").get(Number(req.params.id));
    if (!row) return res.status(404).end();
    const storedPath = req.params.kind === "license" ? row.driving_license_path : row.ownership_document_path;
    const access = await getRiderDocumentAccess(storedPath);
    return access?.filePath ? res.sendFile(access.filePath) : res.redirect(access?.signedUrl || "/");
};

export const recordRiderInspection = async (req, res) => {
    const status = String(req.body?.inspectionStatus || "").trim().toLowerCase();
    const notes = String(req.body?.inspectionNotes || "").trim().slice(0, 1000);
    if (!["passed","failed"].includes(status)) return res.status(400).json({ success:false, message:"Inspection must be passed or failed." });
    const application = db.prepare("SELECT * FROM rider_applications WHERE id=? AND rider_id IS NULL").get(Number(req.params.id));
    if (!application) return res.status(404).json({ success:false, message:"Reviewable application not found." });
    db.prepare("UPDATE rider_applications SET inspection_status=?,inspection_notes=?,reviewed_by=?,reviewed_at=CURRENT_TIMESTAMP,updated_at=CURRENT_TIMESTAMP WHERE id=?").run(status, notes || null, req.admin.username || "admin", application.id);
    let emailSent = false;
    try {
        if (!application.email_verified_at) {
            const verifyToken = token();
            db.prepare("UPDATE rider_applications SET email_verification_token_hash=?,email_verification_expires_at=datetime('now','+24 hours') WHERE id=?").run(hashToken(verifyToken), application.id);
            const verificationUrl = `${getRiderAppUrl()}?verify=${verifyToken}`;
            emailSent = await sendEmail({ to:application.email, subject:"Verify your NutriDust rider application", text:`Your bike inspection was recorded. Verify your email: ${verificationUrl}`, html:`<p>Hello ${application.first_name},</p><p>Your bike inspection was recorded as <strong>${status}</strong>.</p><p><a href="${verificationUrl}">Verify your email to continue onboarding</a>.</p><p>This link expires in 24 hours.</p>` });
        } else {
            emailSent = await sendEmail({ to:application.email, subject:"NutriDust rider inspection update", text:`Your bike inspection result is: ${status}. ${notes}`, html:`<p>Hello ${application.first_name},</p><p>Your bike inspection result is <strong>${status}</strong>.</p>${notes?`<p>Notes: ${notes}</p>`:""}<p>${status==="passed"?"Your application can now proceed to final approval.":"NutriDust will contact you about the next step."}</p>` });
        }
    } catch (error) { console.error("Rider inspection email failed:", error.message); }
    return res.json({ success:true, emailSent, message:emailSent ? "Physical inspection recorded and the rider was emailed." : "Physical inspection recorded, but email could not be sent. Check RESEND_API_KEY and the verified sender domain on Render." });
};

const uniqueUsername = (firstName, surname) => {
    const base = `${firstName}.${surname}`.toLowerCase().replace(/[^a-z0-9.]/g, "").replace(/^\.+|\.+$/g, "") || "rider";
    let candidate = base, suffix = 1;
    while (db.prepare("SELECT 1 FROM riders WHERE lower(username)=lower(?)").get(candidate)) candidate = `${base}${suffix++}`;
    return candidate;
};

export const approveRiderApplication = async (req, res) => {
    const application = db.prepare("SELECT * FROM rider_applications WHERE id=?").get(Number(req.params.id));
    const notes = String(req.body?.notes || "").trim().slice(0,1000);
    if (!application) return res.status(404).json({ success:false, message:"Application not found." });
    if (application.rider_id || application.application_status === "approved") return res.status(409).json({ success:false, message:"This application is already approved." });
    const username = uniqueUsername(application.first_name, application.surname);
    const temporaryPassword = crypto.randomBytes(9).toString("base64url");
    const passwordHash = await bcrypt.hash(temporaryPassword, 12);
    const fullName = [application.first_name, application.middle_name, application.surname].filter(Boolean).join(" ");
    const riderId = db.transaction(() => {
        const result = db.prepare(`INSERT INTO riders
            (full_name,first_name,middle_name,surname,username,phone,email,password_hash,vehicle_type,vehicle_registration_number,application_id,must_change_password,account_status,availability_status)
            VALUES(?,?,?,?,?,?,?,?,?,?,?,1,'active','offline')`).run(fullName,application.first_name,application.middle_name,application.surname,username,application.phone,application.email,passwordHash,application.vehicle_type,application.plate_number,application.id);
        const id = Number(result.lastInsertRowid);
        db.prepare("UPDATE rider_applications SET application_status='approved',inspection_status='passed',inspection_notes=COALESCE(?,inspection_notes),rider_id=?,reviewed_by=?,reviewed_at=CURRENT_TIMESTAMP,updated_at=CURRENT_TIMESTAMP WHERE id=?").run(notes||null,id,req.admin.username || "admin",application.id);
        return id;
    })();
    const loginUrl = getRiderAppUrl();
    let emailSent=false;
    try { emailSent=await sendEmail({ to:application.email, subject:"Your NutriDust rider account is approved", text:`Username: ${username}\nTemporary password: ${temporaryPassword}\nLogin: ${loginUrl}\nYou must change your password after signing in.`, html:`<p>Your rider application passed.</p><p>Username: <strong>${username}</strong><br>Temporary password: <strong>${temporaryPassword}</strong></p><p><a href="${loginUrl}">Sign in</a>. You may change this password after signing in.</p>` }); } catch(error) { console.error("Rider approval email failed:",error.message); }
    return res.status(201).json({ success:true, emailSent, message:emailSent?"Rider passed. Login created and emailed.":"Rider passed and login created, but email was not sent. Check RESEND_API_KEY and the verified sender domain on Render.", riderId, credentials:{ username, temporaryPassword } });
};

export const rejectRiderApplication = (req, res) => {
    const notes = String(req.body?.notes || "").trim().slice(0,1000);
    const result = db.prepare("UPDATE rider_applications SET application_status='rejected',inspection_status='failed',inspection_notes=COALESCE(?,inspection_notes),reviewed_by=?,reviewed_at=CURRENT_TIMESTAMP,updated_at=CURRENT_TIMESTAMP WHERE id=? AND rider_id IS NULL").run(notes || null,req.admin.username || "admin",Number(req.params.id));
    return result.changes ? res.json({ success:true, message:"Application rejected." }) : res.status(404).json({ success:false, message:"Application not found." });
};
