import crypto from "crypto";
import db from "../config/sqlite.js";
import { recordWalletTransaction } from "../services/riderWalletService.js";

export const handlePaystackWebhook = (req,res) => {
    const secret=String(process.env.PAYSTACK_SECRET_KEY||"");
    const signature=String(req.headers["x-paystack-signature"]||"");
    const body=req.rawBody||Buffer.from(JSON.stringify(req.body||{}));
    const expected=crypto.createHmac("sha512",secret).update(body).digest("hex");
    if(!secret||signature.length!==expected.length||!crypto.timingSafeEqual(Buffer.from(signature),Buffer.from(expected)))return res.status(401).send("Invalid signature");
    const event=String(req.body?.event||""),reference=String(req.body?.data?.reference||"");
    const withdrawal=db.prepare("SELECT * FROM rider_withdrawals WHERE provider_reference=?").get(reference);
    if(!withdrawal)return res.sendStatus(200);
    db.transaction(()=>{
        if(event==="transfer.success"&&withdrawal.status==="processing"){
            db.prepare("UPDATE rider_withdrawals SET status='paid',processed_at=CURRENT_TIMESTAMP WHERE id=?").run(withdrawal.id);
            db.prepare("INSERT INTO rider_notifications(rider_id,title,message,type) VALUES(?,'Withdrawal paid',?,'wallet')").run(withdrawal.rider_id,`₦${Number(withdrawal.amount).toLocaleString()} has been sent to your bank account.`);
        }
        if(["transfer.failed","transfer.reversed"].includes(event)&&withdrawal.status==="processing"){
            db.prepare("UPDATE rider_withdrawals SET status='failed',admin_note=?,processed_at=CURRENT_TIMESTAMP WHERE id=?").run(req.body?.data?.reason||"Transfer failed",withdrawal.id);
            recordWalletTransaction({riderId:withdrawal.rider_id,type:"withdrawal_refund",amount:withdrawal.amount,reference:`withdrawal-refund-${withdrawal.id}`,description:`Failed withdrawal #${withdrawal.id} refunded`});
            db.prepare("INSERT INTO rider_notifications(rider_id,title,message,type) VALUES(?,'Withdrawal returned','The bank transfer failed and the full amount was returned to your wallet.','wallet')").run(withdrawal.rider_id);
        }
    })();
    return res.sendStatus(200);
};
