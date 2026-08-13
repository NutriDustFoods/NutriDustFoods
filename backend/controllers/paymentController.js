import db from "../config/sqlite.js";

import {
    initializePayment,
    verifyPayment
} from "../services/paystackService.js";


// =====================================================
// INITIALIZE ORDER PAYMENT
// =====================================================

export const initializeOrderPayment = async (req, res) => {

    try {

        const { orderId } = req.body;


        if (!orderId) {

            return res.status(400).json({

                success: false,

                message: "Order ID is required."

            });

        }


        // Find the order
        const order = db.prepare(`
            SELECT *
            FROM orders
            WHERE id = ?
        `).get(orderId);


        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found."

            });

        }


        // Prevent payment for an already-paid order
        if (order.payment_status === "paid") {

            return res.status(400).json({

                success: false,

                message: "This order has already been paid."

            });

        }


        // Customer email
        const email =
            order.customer_email;


        // Convert Naira to Kobo
        const amount =
            Math.round(
                Number(order.total_amount) * 100
            );


        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {

            return res.status(400).json({

                success: false,

                message: "Invalid order amount."

            });

        }


        // Create unique payment reference
        const reference =
            `NUTRIDUST-${order.id}-${Date.now()}`;


        // Frontend callback URL
        const callbackUrl =
            process.env.FRONTEND_URL ||
            "http://localhost:5173";


        console.log(
            "💳 Initializing Paystack payment:",
            {
                orderId: order.id,
                amount,
                reference
            }
        );


        // Initialize Paystack payment
        const payment =
            await initializePayment({

                email,

                amount,

                reference,

                callbackUrl

            });


        if (
            !payment ||
            !payment.status ||
            !payment.data
        ) {

            return res.status(500).json({

                success: false,

                message:
                    "Paystack could not initialize the payment."

            });

        }


        // Paystack reference
        const paystackReference =
            payment.data.reference;


        // Save payment reference
        db.prepare(`
            UPDATE orders
            SET
                payment_reference = ?,
                payment_status = 'pending',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(
            paystackReference,
            order.id
        );


        console.log(
            "✅ Paystack payment initialized:",
            paystackReference
        );


        res.status(200).json({

            success: true,

            message:
                "Payment initialized successfully.",

            orderId:
                order.id,

            reference:
                paystackReference,

            authorizationUrl:
                payment.data.authorization_url,

            accessCode:
                payment.data.access_code

        });


    } catch (error) {

        console.error(
            "❌ Payment Initialization Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Unable to initialize payment."

        });

    }

};



// =====================================================
// VERIFY ORDER PAYMENT
// =====================================================

export const verifyOrderPayment = async (req, res) => {

    try {

        const { reference } = req.params;


        if (!reference) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment reference is required."

            });

        }


        console.log(
            "🔍 Verifying Paystack payment:",
            reference
        );


        // Verify transaction with Paystack
        const payment =
            await verifyPayment(reference);


        if (
            !payment ||
            !payment.status ||
            !payment.data
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Unable to verify payment."

            });

        }


        const transaction =
            payment.data;


        // Find order using Paystack reference
        const order = db.prepare(`
            SELECT *
            FROM orders
            WHERE payment_reference = ?
        `).get(reference);


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order associated with this payment was not found."

            });

        }


        // Amount paid by Paystack is in Kobo
        const paidAmount =
            Number(transaction.amount);


        // Expected order amount in Kobo
        const expectedAmount =
            Math.round(
                Number(order.total_amount) * 100
            );


        // Verify the amount
        if (
            !Number.isFinite(paidAmount) ||
            paidAmount !== expectedAmount
        ) {

            console.error(
                "❌ Payment amount mismatch:",
                {
                    orderId: order.id,
                    expectedAmount,
                    paidAmount
                }
            );


            return res.status(400).json({

                success: false,

                message:
                    "Payment amount does not match the order amount."

            });

        }


        // Check transaction status
        if (
            transaction.status !== "success"
        ) {

            // Update payment status
            db.prepare(`
                UPDATE orders
                SET
                    payment_status = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `).run(
                transaction.status ||
                    "failed",
                order.id
            );


            return res.status(400).json({

                success: false,

                message:
                    "Payment was not successful.",

                paymentStatus:
                    transaction.status

            });

        }


        // =================================================
        // PAYMENT SUCCESSFUL
        // =================================================

        db.prepare(`
            UPDATE orders
            SET
                payment_status = 'paid',
                order_status = 'processing',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(order.id);


        // Get updated order
        const updatedOrder =
            db.prepare(`
                SELECT *
                FROM orders
                WHERE id = ?
            `).get(order.id);


        console.log(
            "✅ Payment verified successfully:",
            {
                orderId:
                    updatedOrder.id,

                reference:
                    updatedOrder.payment_reference,

                amount:
                    updatedOrder.total_amount
            }
        );


        res.status(200).json({

            success: true,

            message:
                "Payment verified successfully.",

            order:
                updatedOrder,

            transaction: {

                reference:
                    transaction.reference,

                status:
                    transaction.status,

                amount:
                    transaction.amount,

                paidAt:
                    transaction.paid_at,

                channel:
                    transaction.channel

            }

        });


    } catch (error) {

        console.error(
            "❌ Payment Verification Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Unable to verify payment."

        });

    }

};