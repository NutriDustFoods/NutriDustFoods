import db from "../config/sqlite.js";


// =====================================================
// CREATE NEW ORDER
// POST /api/orders
// =====================================================
//
// Inventory flow:
//
// Production:
//     quantity_available = 100
//
// Customer orders 5:
//     quantity_available = 95
//     reserved_quantity = 5
//
// After successful payment:
//     quantity_available = 95
//     reserved_quantity = 0
//     total_sold = 5
//
// =====================================================

export const createOrder = (req, res) => {

    try {

        const {
            customerName,
            customerPhone,
            customerEmail,
            deliveryAddress,
            items
        } = req.body;


        // =================================================
        // BASIC VALIDATION
        // =================================================

        if (
            !customerName ||
            !customerPhone ||
            !customerEmail ||
            !deliveryAddress ||
            !items
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All order information is required."

            });

        }


        if (
            !Array.isArray(items) ||
            items.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Your cart is empty."

            });

        }


        // =================================================
        // PREPARE ORDER ITEMS
        // =================================================

        const requestedItems = [];


        for (const item of items) {

            const productId =
                Number(
                    item.productId ||
                    item.id ||
                    item._id
                );


            const quantity =
                Number(
                    item.quantity
                );


            if (
                !Number.isInteger(productId) ||
                productId <= 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid product in your cart."

                });

            }


            if (
                !Number.isInteger(quantity) ||
                quantity <= 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid product quantity."

                });

            }


            requestedItems.push({

                productId,

                quantity

            });

        }


        // =================================================
        // TRANSACTION
        // =================================================
        //
        // Everything inside this transaction succeeds
        // together or fails together.
        //
        // =================================================

        const transaction =
            db.transaction(() => {

                const finalItems = [];

                let totalAmount = 0;


                // =========================================
                // CHECK EVERY PRODUCT
                // =========================================

                for (
                    const requested
                    of requestedItems
                ) {

                    const product =
                        db.prepare(`
                            SELECT
                                id,
                                name,
                                price
                            FROM products
                            WHERE id = ?
                        `).get(
                            requested.productId
                        );


                    if (!product) {

                        throw new Error(
                            `Product #${requested.productId} was not found.`
                        );

                    }


                    // =====================================
                    // GET INVENTORY
                    // =====================================

                    const inventory =
                        db.prepare(`
                            SELECT
                                product_id,
                                quantity_available,
                                reserved_quantity
                            FROM inventory
                            WHERE product_id = ?
                        `).get(
                            requested.productId
                        );


                    if (!inventory) {

                        throw new Error(
                            `${product.name} does not have an inventory record.`
                        );

                    }


                    const available =
                        Number(
                            inventory.quantity_available
                        );


                    // =====================================
                    // CHECK STOCK
                    // =====================================

                    if (
                        available <
                        requested.quantity
                    ) {

                        throw new Error(

                            `Only ${available} unit(s) of ${product.name} are currently available. You requested ${requested.quantity}.`

                        );

                    }


                    // =====================================
                    // CALCULATE PRICE FROM DATABASE
                    // =====================================
                    //
                    // IMPORTANT:
                    // We do NOT trust the price sent
                    // from the customer's browser.
                    //
                    // =====================================

                    const price =
                        Number(
                            product.price
                        );


                    const itemTotal =
                        price *
                        requested.quantity;


                    totalAmount +=
                        itemTotal;


                    // =====================================
                    // RESERVE STOCK
                    // =====================================

                    db.prepare(`
                        UPDATE inventory

                        SET
                            quantity_available =
                                quantity_available - ?,

                            reserved_quantity =
                                reserved_quantity + ?,

                            updated_at =
                                CURRENT_TIMESTAMP

                        WHERE product_id = ?
                    `).run(

                        requested.quantity,

                        requested.quantity,

                        requested.productId

                    );


                    // =====================================
                    // RECORD RESERVATION
                    // =====================================

                    db.prepare(`
                        INSERT INTO inventory_movements (
                            product_id,
                            movement_type,
                            quantity,
                            reference_id,
                            note
                        )
                        VALUES (?, ?, ?, ?, ?)
                    `).run(

                        requested.productId,

                        "reservation",

                        requested.quantity,

                        null,

                        `Reserved ${requested.quantity} unit(s) for pending order`

                    );


                    // =====================================
                    // SAVE CLEAN ORDER ITEM
                    // =====================================

                    finalItems.push({

                        productId:
                            product.id,

                        name:
                            product.name,

                        price,

                        quantity:
                            requested.quantity,

                        total:
                            itemTotal

                    });

                }


                // =========================================
                // CREATE ORDER
                // =========================================

                const statement =
                    db.prepare(`
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


                const result =
                    statement.run(

                        customerName,

                        customerPhone,

                        customerEmail,

                        deliveryAddress,

                        JSON.stringify(
                            finalItems
                        ),

                        totalAmount

                    );


                // =========================================
                // CONNECT RESERVATIONS TO ORDER
                // =========================================
                //
                // We now know the order ID, so update the
                // reservation movement records.
                //
                // =========================================

                for (
                    const item
                    of finalItems
                ) {

                    db.prepare(`
                        UPDATE inventory_movements

                        SET reference_id = ?

                        WHERE id = (
                            SELECT id
                            FROM inventory_movements
                            WHERE product_id = ?
                              AND movement_type = 'reservation'
                              AND reference_id IS NULL
                            ORDER BY id DESC
                            LIMIT 1
                        )
                    `).run(

                        result.lastInsertRowid,

                        item.productId

                    );

                }


                return {

                    orderId:
                        result.lastInsertRowid,

                    items:
                        finalItems,

                    total:
                        totalAmount

                };

            });


        // =================================================
        // EXECUTE TRANSACTION
        // =================================================

        const orderData =
            transaction();


        // =================================================
        // GET NEW ORDER
        // =================================================

        const order =
            db.prepare(`
                SELECT
                    id,
                    customer_name AS customerName,
                    customer_phone AS customerPhone,
                    customer_email AS customerEmail,
                    delivery_address AS deliveryAddress,
                    items,
                    total_amount AS total,
                    payment_status AS paymentStatus,
                    order_status AS orderStatus,
                    payment_reference AS paymentReference,
                    created_at AS createdAt,
                    updated_at AS updatedAt
                FROM orders
                WHERE id = ?
            `).get(
                orderData.orderId
            );


        // Convert items JSON back to array

        if (order) {

            try {

                order.items =
                    JSON.parse(
                        order.items
                    );

            } catch {

                order.items = [];

            }

        }


        // =================================================
        // SUCCESS
        // =================================================

        res.status(201).json({

            success: true,

            message:
                "Order created successfully and stock reserved.",

            order

        });


    } catch (error) {

        console.error(
            "❌ Create Order Error:",
            error
        );


        // ================================================
        // STOCK ERROR
        // ================================================

        if (
            error.message &&
            (
                error.message.includes(
                    "currently available"
                ) ||
                error.message.includes(
                    "inventory record"
                ) ||
                error.message.includes(
                    "Product #"
                )
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    error.message

            });

        }


        // ================================================
        // GENERAL ERROR
        // ================================================

        res.status(500).json({

            success: false,

            message:
                "Failed to create order.",

            error:
                error.message

        });

    }

};



// =====================================================
// GET ALL ORDERS
// GET /api/orders
// =====================================================

export const getOrders = (req, res) => {

    try {

        const orders =
            db.prepare(`
                SELECT
                    id,

                    customer_name
                        AS customerName,

                    customer_phone
                        AS customerPhone,

                    customer_email
                        AS customerEmail,

                    delivery_address
                        AS deliveryAddress,

                    items,

                    total_amount
                        AS total,

                    payment_status
                        AS paymentStatus,

                    order_status
                        AS orderStatus,

                    payment_reference
                        AS paymentReference,

                    created_at
                        AS createdAt,

                    updated_at
                        AS updatedAt

                FROM orders

                ORDER BY
                    created_at DESC
            `)
            .all();


        // Convert items JSON into arrays

        orders.forEach(
            order => {

                try {

                    order.items =
                        JSON.parse(
                            order.items
                        );

                } catch {

                    order.items = [];

                }

            }
        );


        res.status(200).json({

            success: true,

            orders

        });


    } catch (error) {

        console.error(
            "Get Orders Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to get orders.",

            error:
                error.message

        });

    }

};