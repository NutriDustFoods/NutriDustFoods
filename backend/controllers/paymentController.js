import db from "../config/sqlite.js";
import { initializePayment } from "../services/paystackService.js";


// Initialize payment for an existing order
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


        // Prevent payment for an already paid order
        if (order.payment_status === "paid") {

            return res.status(400).json({

                success: false,

                message: "This order has already been paid."

            });

        }


        // Customer email
        const email = order.customer_email;


        // Convert Naira to Kobo
        const amount = Math.round(
            Number(order.total_amount) * 100
        );


        if (!Number.isFinite(amount) || amount <= 0) {

            return res.status(400).json({

                success: false,

                message: "Invalid order amount."

            });

        }


        // Create a unique payment reference
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


        // Initialize Paystack
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


        // Get Paystack reference
        const paystackReference =
            payment.data.reference;


        // Save Paystack reference against the order
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


        // Return payment information to frontend
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