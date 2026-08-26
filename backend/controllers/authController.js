import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/sqlite.js";


// =====================================================
// JWT SECRET
// =====================================================

const JWT_SECRET =
    process.env.JWT_SECRET ||
    "nutridust-development-secret-change-this";


// =====================================================
// CREATE JWT
// =====================================================

const createToken = customer => {

    return jwt.sign(

        {
            customerId:
                customer.id,

            email:
                customer.email

        },

        JWT_SECRET,

        {
            expiresIn:
                "7d"
        }

    );

};


// =====================================================
// SIGN UP
// POST /api/auth/signup
// =====================================================

export const signup = async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            password
        } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (
            !name ||
            !email ||
            !phone ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Name, email, phone and password are required."

            });

        }


        const cleanName =
            String(name).trim();


        const cleanEmail =
            String(email)
                .trim()
                .toLowerCase();


        const cleanPhone =
            String(phone).trim();


        if (
            cleanName.length < 2
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter your full name."

            });

        }


        // =================================================
        // EMAIL VALIDATION
        // =================================================

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailPattern.test(
                cleanEmail
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter a valid email address."

            });

        }


        // =================================================
        // PASSWORD VALIDATION
        // =================================================

        if (
            String(password).length < 6
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must be at least 6 characters."

            });

        }


        // =================================================
        // CHECK EXISTING EMAIL
        // =================================================

        const existingEmail =
            db.prepare(`
                SELECT id
                FROM customers
                WHERE email = ?
            `).get(
                cleanEmail
            );


        if (existingEmail) {

            return res.status(409).json({

                success: false,

                message:
                    "An account with this email already exists."

            });

        }


        // =================================================
        // CHECK EXISTING PHONE
        // =================================================

        const existingPhone =
            db.prepare(`
                SELECT id
                FROM customers
                WHERE phone = ?
            `).get(
                cleanPhone
            );


        if (existingPhone) {

            return res.status(409).json({

                success: false,

                message:
                    "An account with this phone number already exists."

            });

        }


        // =================================================
        // HASH PASSWORD
        // =================================================

        const passwordHash =
            await bcrypt.hash(
                String(password),
                12
            );


        // =================================================
        // CREATE CUSTOMER
        // =================================================

        const result =
            db.prepare(`
                INSERT INTO customers (
                    name,
                    email,
                    phone,
                    password_hash
                )
                VALUES (?, ?, ?, ?)
            `).run(

                cleanName,

                cleanEmail,

                cleanPhone,

                passwordHash

            );


        // =================================================
        // GET CUSTOMER
        // =================================================

        const customer =
            db.prepare(`
                SELECT
                    id,
                    name,
                    email,
                    phone,
                    created_at AS createdAt,
                    updated_at AS updatedAt
                FROM customers
                WHERE id = ?
            `).get(
                result.lastInsertRowid
            );


        // =================================================
        // CREATE TOKEN
        // =================================================

        const token =
            createToken(
                customer
            );


        // =================================================
        // SUCCESS
        // =================================================

        return res.status(201).json({

            success: true,

            message:
                "Account created successfully.",

            token,

            customer

        });


    } catch (error) {

        console.error(
            "❌ Signup Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to create your account.",

            error:
                error.message

        });

    }

};



// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================

export const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required."

            });

        }


        const cleanEmail =
            String(email)
                .trim()
                .toLowerCase();


        // =================================================
        // FIND CUSTOMER
        // =================================================

        const customer =
            db.prepare(`
                SELECT
                    id,
                    name,
                    email,
                    phone,
                    password_hash AS passwordHash,
                    created_at AS createdAt,
                    updated_at AS updatedAt
                FROM customers
                WHERE email = ?
            `).get(
                cleanEmail
            );


        if (!customer) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }


        // =================================================
        // VERIFY PASSWORD
        // =================================================

        const passwordMatches =
            await bcrypt.compare(

                String(password),

                customer.passwordHash

            );


        if (!passwordMatches) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }


        // =================================================
        // REMOVE PASSWORD HASH
        // =================================================

        delete customer.passwordHash;


        // =================================================
        // CREATE TOKEN
        // =================================================

        const token =
            createToken(
                customer
            );


        // =================================================
        // SUCCESS
        // =================================================

        return res.status(200).json({

            success: true,

            message:
                "Login successful.",

            token,

            customer

        });


    } catch (error) {

        console.error(
            "❌ Login Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to login.",

            error:
                error.message

        });

    }

};



// =====================================================
// GET CURRENT CUSTOMER
// GET /api/auth/me
// =====================================================

export const getMe = (req, res) => {

    try {

        const customer =
            db.prepare(`
                SELECT
                    id,
                    name,
                    email,
                    phone,
                    created_at AS createdAt,
                    updated_at AS updatedAt
                FROM customers
                WHERE id = ?
            `).get(
                req.customer.id
            );


        if (!customer) {

            return res.status(404).json({

                success: false,

                message:
                    "Customer account not found."

            });

        }


        return res.status(200).json({

            success: true,

            customer

        });


    } catch (error) {

        console.error(
            "❌ Get Current Customer Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to load customer account.",

            error:
                error.message

        });

    }

};