import jwt from "jsonwebtoken";


// =====================================================
// ADMIN LOGIN
// POST /api/admin/login
// =====================================================

export const adminLogin = (req, res) => {

    try {

        const { username, password } = req.body;

        const adminUsername =
            process.env.ADMIN_USERNAME;

        const adminPassword =
            process.env.ADMIN_PASSWORD;


        if (!adminUsername || !adminPassword) {

            return res.status(500).json({
                success: false,
                message:
                    "Admin credentials are not configured."
            });

        }


        if (
            username !== adminUsername ||
            password !== adminPassword
        ) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid username or password."
            });

        }


        if (!process.env.JWT_SECRET) {

            return res.status(500).json({
                success: false,
                message:
                    "JWT_SECRET is not configured."
            });

        }


        const token = jwt.sign(
            {
                username: adminUsername,
                role: "admin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "8h"
            }
        );


        return res.status(200).json({

            success: true,

            message:
                "Admin login successful.",

            token,

            admin: {
                username: adminUsername,
                role: "admin"
            }

        });


    } catch (error) {

        console.error(
            "❌ Admin login error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to process admin login."

        });

    }

};