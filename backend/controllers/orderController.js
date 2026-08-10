import db from "../config/sqlite.js";


// Create a new order
export const createOrder = (req, res) => {

    try {

        const {
            customerName,
            customerPhone,
            customerEmail,
            deliveryAddress,
            items,
            total
        } = req.body;


        // Check required information
        if (
            !customerName ||
            !customerPhone ||
            !customerEmail ||
            !deliveryAddress ||
            !items ||
            total === undefined
        ) {

            return res.status(400).json({

                success: false,

                message: "All order information is required."

            });

        }


        // Save order
        const statement = db.prepare(`
            INSERT INTO orders (
                customer_name,
                customer_phone,
                customer_email,
                delivery_address,
                items,
                total_amount
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `);


        const result = statement.run(

            customerName,

            customerPhone,

            customerEmail,

            deliveryAddress,

            JSON.stringify(items),

            total

        );


        // Get the newly created order
        const order = db.prepare(`
            SELECT *
            FROM orders
            WHERE id = ?
        `).get(result.lastInsertRowid);


        res.status(201).json({

            success: true,

            message: "Order created successfully.",

            order

        });


    } catch (error) {

        console.error("Create Order Error:", error);


        res.status(500).json({

            success: false,

            message: "Failed to create order.",

            error: error.message

        });

    }

};



// Get all orders
export const getOrders = (req, res) => {

    try {

        const orders = db.prepare(`
            SELECT *
            FROM orders
            ORDER BY created_at DESC
        `).all();


        res.status(200).json({

            success: true,

            orders

        });


    } catch (error) {

        console.error("Get Orders Error:", error);


        res.status(500).json({

            success: false,

            message: "Failed to get orders.",

            error: error.message

        });

    }

};