import crypto from "crypto";
import db from "../config/sqlite.js";

const clean = value => String(value || "").trim();
const referralCode = rider => {
    if (rider.referral_code) return rider.referral_code;
    const code = `ND${rider.id}${crypto.randomBytes(3).toString("hex")}`.toUpperCase();
    db.prepare("UPDATE riders SET referral_code = ? WHERE id = ?").run(code, rider.id);
    return code;
};

export const getCommerceDashboard = (req, res) => {
    const code = referralCode(req.rider);
    const subscription = db.prepare(`SELECT s.id,s.status,s.starts_at AS startsAt,s.expires_at AS expiresAt,
        s.amount_paid AS amountPaid,p.name AS planName,p.description FROM rider_subscriptions s
        JOIN rider_subscription_plans p ON p.id=s.plan_id WHERE s.rider_id=? ORDER BY s.id DESC LIMIT 1`).get(req.rider.id) || null;
    const plans = db.prepare("SELECT id,name,price,duration_days AS durationDays,description FROM rider_subscription_plans WHERE is_active=1 ORDER BY price").all();
    const referrals = db.prepare(`SELECT rr.id,rr.status,rr.reward_amount AS rewardAmount,rr.created_at AS createdAt,
        r.full_name AS riderName FROM rider_referrals rr JOIN riders r ON r.id=rr.referred_rider_id
        WHERE rr.referrer_rider_id=? ORDER BY rr.id DESC`).all(req.rider.id);
    const withdrawals = db.prepare("SELECT id,amount,status,bank_name AS bankName,account_name AS accountName,account_number_masked AS accountNumber,admin_note AS adminNote,created_at AS createdAt,processed_at AS processedAt FROM rider_withdrawals WHERE rider_id=? ORDER BY id DESC").all(req.rider.id);
    return res.json({ success:true, referralCode:code, subscription, plans, referrals, withdrawals });
};

export const activateSubscription = (req, res) => {
    const planId = Number(req.body?.planId);
    const plan = db.prepare("SELECT * FROM rider_subscription_plans WHERE id=? AND is_active=1").get(planId);
    if (!plan) return res.status(404).json({ success:false, message:"Subscription plan not found." });
    try {
        const subscription = db.transaction(() => {
            const rider = db.prepare("SELECT wallet_balance FROM riders WHERE id=?").get(req.rider.id);
            if (Number(rider.wallet_balance) < Number(plan.price)) throw Object.assign(new Error("Your wallet balance is not sufficient for this plan."), { status:409 });
            db.prepare("UPDATE rider_subscriptions SET status='expired' WHERE rider_id=? AND status='active'").run(req.rider.id);
            if (Number(plan.price) > 0) db.prepare("UPDATE riders SET wallet_balance=wallet_balance-?,updated_at=CURRENT_TIMESTAMP WHERE id=?").run(plan.price, req.rider.id);
            const result = db.prepare(`INSERT INTO rider_subscriptions(rider_id,plan_id,status,expires_at,amount_paid)
                VALUES(?,?,'active',datetime('now',? || ' days'),?)`).run(req.rider.id, plan.id, String(plan.duration_days), plan.price);
            return db.prepare("SELECT * FROM rider_subscriptions WHERE id=?").get(result.lastInsertRowid);
        })();
        return res.status(201).json({ success:true, subscription });
    } catch (error) {
        return res.status(error.status || 500).json({ success:false, message:error.status ? error.message : "Unable to activate subscription." });
    }
};

export const applyReferral = (req, res) => {
    const code = clean(req.body?.code).toUpperCase();
    if (!code) return res.status(400).json({ success:false, message:"Referral code is required." });
    if (req.rider.referred_by_rider_id) return res.status(409).json({ success:false, message:"A referral has already been applied." });
    const referrer = db.prepare("SELECT id FROM riders WHERE referral_code=? AND id<>?").get(code, req.rider.id);
    if (!referrer) return res.status(404).json({ success:false, message:"Referral code is invalid." });
    db.transaction(() => {
        db.prepare("UPDATE riders SET referred_by_rider_id=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND referred_by_rider_id IS NULL").run(referrer.id, req.rider.id);
        db.prepare("INSERT INTO rider_referrals(referrer_rider_id,referred_rider_id,reward_amount) VALUES(?,?,?)").run(referrer.id, req.rider.id, Number(process.env.RIDER_REFERRAL_REWARD || 500));
    })();
    return res.json({ success:true, message:"Referral applied. The reward becomes available after your first completed delivery." });
};

export const requestWithdrawal = (req, res) => {
    const amount = Number(req.body?.amount), bankName = clean(req.body?.bankName), accountName = clean(req.body?.accountName), accountNumber = clean(req.body?.accountNumber).replace(/\D/g, "");
    const minimum = Number(process.env.RIDER_MIN_WITHDRAWAL || 1000);
    if (!Number.isFinite(amount) || amount < minimum) return res.status(400).json({ success:false, message:`Minimum withdrawal is ₦${minimum.toLocaleString()}.` });
    if (!bankName || !accountName || accountNumber.length < 10) return res.status(400).json({ success:false, message:"Complete bank details are required." });
    try {
        const withdrawal = db.transaction(() => {
            const rider = db.prepare("SELECT wallet_balance FROM riders WHERE id=?").get(req.rider.id);
            if (Number(rider.wallet_balance) < amount) throw Object.assign(new Error("Insufficient wallet balance."), { status:409 });
            db.prepare("UPDATE riders SET wallet_balance=wallet_balance-?,bank_name=?,bank_account_name=?,bank_account_number=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").run(amount, bankName, accountName, accountNumber, req.rider.id);
            const masked = `${"*".repeat(Math.max(0, accountNumber.length - 4))}${accountNumber.slice(-4)}`;
            const result = db.prepare("INSERT INTO rider_withdrawals(rider_id,amount,bank_name,account_name,account_number_masked) VALUES(?,?,?,?,?)").run(req.rider.id, amount, bankName, accountName, masked);
            return db.prepare("SELECT * FROM rider_withdrawals WHERE id=?").get(result.lastInsertRowid);
        })();
        return res.status(201).json({ success:true, withdrawal });
    } catch (error) {
        return res.status(error.status || 500).json({ success:false, message:error.status ? error.message : "Unable to request withdrawal." });
    }
};

export const savePushSubscription = (req, res) => {
    const endpoint = clean(req.body?.endpoint);
    if (!endpoint) return res.status(400).json({ success:false, message:"A valid push subscription is required." });
    db.prepare(`INSERT INTO rider_push_subscriptions(rider_id,endpoint,subscription_json) VALUES(?,?,?)
        ON CONFLICT(endpoint) DO UPDATE SET rider_id=excluded.rider_id,subscription_json=excluded.subscription_json,updated_at=CURRENT_TIMESTAMP`).run(req.rider.id, endpoint, JSON.stringify(req.body));
    return res.status(201).json({ success:true });
};

export const listWithdrawals = (req, res) => res.json({ success:true, withdrawals:db.prepare(`SELECT w.*,r.full_name AS riderName,r.phone FROM rider_withdrawals w JOIN riders r ON r.id=w.rider_id ORDER BY w.id DESC`).all() });

export const processWithdrawal = (req, res) => {
    const id = Number(req.params.id), status = clean(req.body?.status).toLowerCase(), note = clean(req.body?.note).slice(0, 500) || null;
    if (!["paid", "rejected"].includes(status)) return res.status(400).json({ success:false, message:"Status must be paid or rejected." });
    try {
        db.transaction(() => {
            const withdrawal = db.prepare("SELECT * FROM rider_withdrawals WHERE id=?").get(id);
            if (!withdrawal) throw Object.assign(new Error("Withdrawal not found."), { status:404 });
            if (withdrawal.status !== "pending") throw Object.assign(new Error("Withdrawal has already been processed."), { status:409 });
            db.prepare("UPDATE rider_withdrawals SET status=?,admin_note=?,processed_at=CURRENT_TIMESTAMP WHERE id=?").run(status, note, id);
            if (status === "rejected") db.prepare("UPDATE riders SET wallet_balance=wallet_balance+?,updated_at=CURRENT_TIMESTAMP WHERE id=?").run(withdrawal.amount, withdrawal.rider_id);
            db.prepare("INSERT INTO rider_notifications(rider_id,title,message,type) VALUES(?,?,?,'wallet')").run(withdrawal.rider_id, `Withdrawal ${status}`, note || `Your withdrawal request was ${status}.`);
        })();
        return res.json({ success:true });
    } catch (error) {
        return res.status(error.status || 500).json({ success:false, message:error.status ? error.message : "Unable to process withdrawal." });
    }
};

export const qualifyReferralReward = riderId => {
    const referral = db.prepare("SELECT * FROM rider_referrals WHERE referred_rider_id=? AND status='pending'").get(riderId);
    if (!referral) return;
    db.prepare("UPDATE rider_referrals SET status='rewarded',rewarded_at=CURRENT_TIMESTAMP WHERE id=?").run(referral.id);
    db.prepare("UPDATE riders SET wallet_balance=wallet_balance+?,total_earnings=total_earnings+?,updated_at=CURRENT_TIMESTAMP WHERE id=?").run(referral.reward_amount, referral.reward_amount, referral.referrer_rider_id);
    db.prepare("INSERT INTO rider_notifications(rider_id,title,message,type) VALUES(?,'Referral reward earned',?,'referral')").run(referral.referrer_rider_id, `₦${Number(referral.reward_amount).toLocaleString()} was added to your wallet.`);
};
