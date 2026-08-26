import jwt from "jsonwebtoken";


// =====================================================
// ADMIN AUTHENTICATION MIDDLEWARE
// =====================================================

export const adminAuth = (req, res, next) => {

    try {

        const authHeader =
            req.headers.authorization;


        // -------------------------------------------------
        // Check Authorization header
        // -------------------------------------------------

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required."

            });

        }


        // -------------------------------------------------
        // Get token
        // -------------------------------------------------

        const token =
            authHeader.split(" ")[1];


        if (!token) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication token is missing."

            });

        }


        // -------------------------------------------------
        // Verify JWT
        // -------------------------------------------------

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        if (decoded?.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Administrator access required."
            });
        }


        // -------------------------------------------------
        // Attach admin information
        // -------------------------------------------------

        req.admin = decoded;


        // -------------------------------------------------
        // Continue
        // -------------------------------------------------

        next();


    } catch (error) {

        console.error(
            "❌ Admin authentication error:",
            error.message
        );


        return res.status(401).json({

            success: false,

            message:
                "Invalid or expired authentication token."

        });

    }

};
