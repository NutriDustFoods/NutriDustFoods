import jwt from "jsonwebtoken";


// =====================================================
// JWT SECRET
// =====================================================
//
// IMPORTANT:
//
// In production, JWT_SECRET MUST be stored in .env.
//
// Example:
//
// JWT_SECRET=your-long-random-secret
//
// The fallback below is only for local development.
//
// =====================================================

const JWT_SECRET =
    process.env.JWT_SECRET ||
    "nutridust-development-secret-change-this";


// =====================================================
// CUSTOMER AUTHENTICATION MIDDLEWARE
// =====================================================
//
// Reads:
//
// Authorization: Bearer <JWT>
//
// Then attaches:
//
// req.customer
//
// Example:
//
// req.customer = {
//     id: 5,
//     email: "customer@example.com"
// }
//
// =====================================================

export const authenticateCustomer = (
    req,
    res,
    next
) => {

    try {

        // =================================================
        // GET AUTHORIZATION HEADER
        // =================================================

        const authorization =
            req.headers.authorization;


        // =================================================
        // CHECK AUTHORIZATION HEADER
        // =================================================

        if (
            !authorization ||
            typeof authorization !== "string"
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required. Please login."

            });

        }


        // =================================================
        // CHECK BEARER FORMAT
        // =================================================

        if (
            !authorization.startsWith(
                "Bearer "
            )
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid authentication format."

            });

        }


        // =================================================
        // EXTRACT TOKEN
        // =================================================

        const token =
            authorization
                .slice(7)
                .trim();


        if (!token) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication token is missing."

            });

        }


        // =================================================
        // VERIFY JWT
        // =================================================

        const decoded =
            jwt.verify(
                token,
                JWT_SECRET
            );


        // =================================================
        // VALIDATE DECODED TOKEN
        // =================================================

        if (
            !decoded ||
            typeof decoded !== "object"
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid authentication token."

            });

        }


        // =================================================
        // GET CUSTOMER ID
        // =================================================

        const customerId =
            Number(
                decoded.customerId
            );


        if (
            !Number.isInteger(
                customerId
            ) ||
            customerId <= 0
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid customer authentication token."

            });

        }


        // =================================================
        // ATTACH CUSTOMER TO REQUEST
        // =================================================
        //
        // The controllers will use:
        //
        // req.customer.id
        //
        // The database is then queried using this ID.
        //
        // We deliberately do NOT trust customer name,
        // phone or email from the frontend.
        //
        // =================================================

        req.customer = {

            id:
                customerId,

            email:
                typeof decoded.email === "string"
                    ? decoded.email
                    : null

        };


        // =================================================
        // CONTINUE REQUEST
        // =================================================

        return next();


    } catch (error) {

        console.error(
            "❌ Customer Authentication Error:",
            error.message
        );


        // =================================================
        // EXPIRED TOKEN
        // =================================================

        if (
            error.name ===
            "TokenExpiredError"
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Your session has expired. Please login again."

            });

        }


        // =================================================
        // INVALID TOKEN
        // =================================================

        if (
            error.name ===
            "JsonWebTokenError"
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid authentication token. Please login again."

            });

        }


        // =================================================
        // OTHER AUTHENTICATION ERROR
        // =================================================

        return res.status(401).json({

            success: false,

            message:
                "Authentication failed. Please login again."

        });

    }

};