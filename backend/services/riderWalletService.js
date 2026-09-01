import db from "../config/sqlite.js";

export const walletBalance = riderId => Number(db.prepare("SELECT wallet_balance FROM riders WHERE id=?").get(riderId)?.wallet_balance || 0);

export const recordWalletTransaction = ({ riderId, type, amount, reference, description }) => {
    const numeric = Number(amount);
    if (!Number.isFinite(numeric) || numeric === 0) throw new Error("A non-zero wallet amount is required.");
    const existing = db.prepare("SELECT * FROM rider_wallet_transactions WHERE reference=?").get(reference);
    if (existing) return existing;
    const balance = walletBalance(riderId);
    const next = Number((balance + numeric).toFixed(2));
    if (next < 0) throw Object.assign(new Error("Insufficient wallet balance."), { status:409 });
    db.prepare("UPDATE riders SET wallet_balance=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").run(next, riderId);
    const id = Number(db.prepare(`INSERT INTO rider_wallet_transactions
        (rider_id,transaction_type,amount,balance_after,reference,description) VALUES(?,?,?,?,?,?)`)
        .run(riderId, type, numeric, next, reference, description || null).lastInsertRowid);
    return db.prepare("SELECT * FROM rider_wallet_transactions WHERE id=?").get(id);
};

export const walletStatement = riderId => db.prepare(`SELECT id,transaction_type AS transactionType,amount,balance_after AS balanceAfter,
    reference,description,created_at AS createdAt FROM rider_wallet_transactions WHERE rider_id=? ORDER BY id DESC LIMIT 100`).all(riderId);
