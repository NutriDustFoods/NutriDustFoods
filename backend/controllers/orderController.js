import db from "../config/sqlite.js";
import { calculateDeliveryQuote } from "../services/deliveryPricingService.js";


// =====================================================
// HELPER: PARSE ORDER ITEMS
// =====================================================

const parseOrderItems = (order) => {

    if (!order) {
        return order;
    }

    try {

        order.items =
            typeof order.items === "string"
                ? JSON.parse(order.items)
                : order.items;

    } catch {

        order.items = [];

    }

    return order;

};


// =====================================================
// HELPER: GET AUTHENTICATED CUSTOMER
// =====================================================

const getAuthenticatedCustomer = (req) => {

    const customerId =
        Number(req.customer?.id);


    if (
        !Number.isInteger(customerId) ||
        customerId <= 0
    ) {

        return null;

    }


    return db.prepare(`
        SELECT
            id,
            name,
            email,
            phone
        FROM customers
        WHERE id = ?
    `).get(
        customerId
    );

};


// =====================================================
// HELPER: GET CUSTOMER ORDER
// =====================================================

const getCustomerOrder = (
    orderId,
    customerId
) => {

    return db.prepare(`
        SELECT

            id,

            customer_id
                AS customerId,

            customer_name
                AS customerName,

            customer_phone
                AS customerPhone,

            customer_email
                AS customerEmail,

            delivery_address
                AS deliveryAddress,

            fulfillment_type
                AS fulfillmentType,

            delivery_fee
                AS deliveryFee,

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

        WHERE
            id = ?

            AND

            customer_id = ?

    `).get(

        orderId,

        customerId

    );

};


// =====================================================
// HELPER: FORMAT CUSTOMER ORDER
// =====================================================

const formatOrder = (order) => {

    if (!order) {
        return null;
    }

    parseOrderItems(order);

    return order;

};


// =====================================================
// CREATE NEW ORDER
// POST /api/orders
// =====================================================

export const createOrder = async (req, res) => {

    try {

        // =================================================
        // AUTHENTICATED CUSTOMER
        // =================================================

        const customer =
            getAuthenticatedCustomer(req);


        if (!customer) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required. Please login."

            });

        }


        // =================================================
        // REQUEST DATA
        // =================================================

        const {
            deliveryAddress,
            fulfillmentType,
            items
        } = req.body;

        const cleanFulfillmentType = String(fulfillmentType || "delivery").trim().toLowerCase();
        if (!["delivery", "pickup"].includes(cleanFulfillmentType)) {
            return res.status(400).json({ success: false, message: "Choose delivery or customer pickup." });
        }


        // =================================================
        // DELIVERY ADDRESS
        // =================================================

        if (
            cleanFulfillmentType === "delivery" && (!deliveryAddress ||
            !String(
                deliveryAddress
            ).trim())
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Delivery address is required."

            });

        }


        const cleanDeliveryAddress = cleanFulfillmentType === "delivery"
            ? String(deliveryAddress).trim()
            : "Customer pickup";

        const deliveryQuote = cleanFulfillmentType === "delivery"
            ? await calculateDeliveryQuote(cleanDeliveryAddress)
            : { fee:0, distanceMeters:null };


        if (
            cleanFulfillmentType === "delivery" && cleanDeliveryAddress.length < 5
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please provide a complete delivery address."

            });

        }


        // =================================================
        // CART VALIDATION
        // =================================================

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
        // CONSOLIDATE DUPLICATE PRODUCTS
        // =================================================

        const itemMap =
            new Map();


        for (
            const item
            of items
        ) {

            const productId =
                Number(
                    item?.productId ||
                    item?.id ||
                    item?._id
                );


            const quantity =
                Number(
                    item?.quantity
                );


            // =============================================
            // VALIDATE PRODUCT ID
            // =============================================

            if (

                !Number.isInteger(
                    productId
                ) ||

                productId <= 0

            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid product in your cart."

                });

            }


            // =============================================
            // VALIDATE QUANTITY
            // =============================================

            if (

                !Number.isInteger(
                    quantity
                ) ||

                quantity <= 0

            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid product quantity."

                });

            }


            const currentQuantity =
                itemMap.get(
                    productId
                ) || 0;


            const newQuantity =
                currentQuantity +
                quantity;


            if (
                newQuantity >
                Number.MAX_SAFE_INTEGER
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Requested quantity is too large."

                });

            }


            itemMap.set(
                productId,
                newQuantity
            );

        }


        const requestedItems =
            Array.from(
                itemMap.entries()
            ).map(
                ([productId, quantity]) => ({

                    productId,

                    quantity

                })
            );


        // =================================================
        // DATABASE TRANSACTION
        // =================================================

        const transaction =
            db.transaction(() => {

                const finalItems = [];

                let totalAmount = 0;


                // =================================================
                // PROCESS PRODUCTS
                // =================================================

                for (
                    const requested
                    of requestedItems
                ) {

                    // =============================================
                    // GET PRODUCT
                    // =============================================

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

                        const error =
                            new Error(
                                `Product #${requested.productId} was not found.`
                            );


                        error.code =
                            "PRODUCT_NOT_FOUND";


                        throw error;

                    }


                    // =============================================
                    // GET INVENTORY
                    // =============================================

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

                        const error =
                            new Error(
                                `${product.name} does not have an inventory record.`
                            );


                        error.code =
                            "INVENTORY_NOT_FOUND";


                        throw error;

                    }


                    // =============================================
                    // AVAILABLE STOCK
                    // =============================================

                    const available =
                        Number(
                            inventory.quantity_available
                        );


                    if (

                        !Number.isInteger(
                            available
                        ) ||

                        available < 0

                    ) {

                        const error =
                            new Error(
                                `Invalid inventory quantity for ${product.name}.`
                            );


                        error.code =
                            "INVALID_INVENTORY";


                        throw error;

                    }


                    // =============================================
                    // STOCK CHECK
                    // =============================================

                    if (
                        available <
                        requested.quantity
                    ) {

                        const error =
                            new Error(

                                `Only ${available} unit(s) of ${product.name} are currently available. You requested ${requested.quantity}.`

                            );


                        error.code =
                            "INSUFFICIENT_STOCK";


                        throw error;

                    }


                    // =============================================
                    // DATABASE PRICE
                    // =============================================

                    const price =
                        Number(
                            product.price
                        );


                    if (

                        !Number.isFinite(
                            price
                        ) ||

                        price <= 0

                    ) {

                        const error =
                            new Error(
                                `Invalid price configured for ${product.name}.`
                            );


                        error.code =
                            "INVALID_PRICE";


                        throw error;

                    }


                    // =============================================
                    // CALCULATE ITEM TOTAL
                    // =============================================

                    const itemTotal =
                        price *
                        requested.quantity;


                    if (
                        !Number.isFinite(
                            itemTotal
                        )
                    ) {

                        const error =
                            new Error(
                                `Unable to calculate price for ${product.name}.`
                            );


                        error.code =
                            "PRICE_CALCULATION_ERROR";


                        throw error;

                    }


                    totalAmount +=
                        itemTotal;


                    // =============================================
                    // RESERVE STOCK
                    // =============================================

                    const inventoryUpdate =
                        db.prepare(`
                            UPDATE inventory

                            SET

                                quantity_available =
                                    quantity_available - ?,

                                reserved_quantity =
                                    reserved_quantity + ?,

                                updated_at =
                                    CURRENT_TIMESTAMP

                            WHERE

                                product_id = ?

                                AND

                                quantity_available >= ?

                        `).run(

                            requested.quantity,

                            requested.quantity,

                            requested.productId,

                            requested.quantity

                        );


                    if (
                        inventoryUpdate.changes !== 1
                    ) {

                        const error =
                            new Error(

                                `Unable to reserve stock for ${product.name}. Please try again.`

                            );


                        error.code =
                            "RESERVATION_FAILED";


                        throw error;

                    }


                    // =============================================
                    // SAVE FINAL ITEM
                    // =============================================

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


                // =================================================
                // VALIDATE TOTAL
                // =================================================

                if (

                    !Number.isFinite(
                        totalAmount
                    ) ||

                    totalAmount <= 0

                ) {

                    const error =
                        new Error(
                            "Unable to calculate a valid order total."
                        );


                    error.code =
                        "INVALID_ORDER_TOTAL";


                    throw error;

                }


                // =================================================
                // CREATE ORDER
                // =================================================

                const deliveryFee = deliveryQuote.fee;

                totalAmount += deliveryFee;

                const result =
                    db.prepare(`
                        INSERT INTO orders (

                            customer_id,

                            customer_name,

                            customer_phone,

                            customer_email,

                            delivery_address,

                            items,

                            total_amount,

                            payment_status,

                            order_status
                            ,fulfillment_type
                            ,delivery_fee
                            ,delivery_distance_meters

                        )

                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

                    `).run(

                        customer.id,

                        customer.name,

                        customer.phone,

                        customer.email,

                        cleanDeliveryAddress,

                        JSON.stringify(
                            finalItems
                        ),

                        totalAmount,

                        "pending",

                        "pending"

                        ,cleanFulfillmentType

                        ,deliveryFee
                        ,deliveryQuote.distanceMeters

                    );


                const orderId =
                    Number(
                        result.lastInsertRowid
                    );


                // =================================================
                // RECORD RESERVATION MOVEMENTS
                // =================================================

                for (
                    const item
                    of finalItems
                ) {

                    db.prepare(`
                        INSERT INTO inventory_movements (

                            product_id,

                            movement_type,

                            quantity,

                            reference_id,

                            note,

                            performed_by

                        )

                        VALUES (?, ?, ?, ?, ?, ?)

                    `).run(

                        item.productId,

                        "reservation",

                        item.quantity,

                        orderId,

                        `Reserved ${item.quantity} unit(s) for Order #${orderId}`,

                        `CUSTOMER:${customer.id}`

                    );

                }


                return {

                    orderId,

                    total:
                        totalAmount

                };

            });


        // =================================================
        // EXECUTE TRANSACTION
        // =================================================

        const created =
            transaction();


        // =================================================
        // GET CREATED ORDER
        // =================================================

        const order =
            getCustomerOrder(

                created.orderId,

                customer.id

            );


        if (!order) {

            return res.status(500).json({

                success: false,

                message:
                    "Order was created but could not be loaded."

            });

        }


        parseOrderItems(
            order
        );


        // =================================================
        // SUCCESS
        // =================================================

        return res.status(201).json({

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


        const clientErrorCodes = [

            "PRODUCT_NOT_FOUND",

            "INVENTORY_NOT_FOUND",

            "INVALID_INVENTORY",

            "INSUFFICIENT_STOCK",

            "INVALID_PRICE",

            "PRICE_CALCULATION_ERROR",

            "RESERVATION_FAILED",

            "INVALID_ORDER_TOTAL"

        ];


        if (
            clientErrorCodes.includes(
                error.code
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    error.message

            });

        }


        return res.status(500).json({

            success: false,

            message:
                "Failed to create order.",

            error:
                error.message

        });

    }

};


// =====================================================
// GET MY ORDERS
// GET /api/orders/my
// =====================================================

export const getMyOrders = (req, res) => {

    try {

        // =================================================
        // AUTHENTICATED CUSTOMER
        // =================================================

        const customer =
            getAuthenticatedCustomer(req);


        if (!customer) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required. Please login."

            });

        }


        // =================================================
        // GET CUSTOMER ORDERS
        // =================================================

        const orders =
            db.prepare(`
                SELECT

                    id,

                    customer_id
                        AS customerId,

                    customer_name
                        AS customerName,

                    customer_phone
                        AS customerPhone,

                    customer_email
                        AS customerEmail,

                    delivery_address
                        AS deliveryAddress,

                    fulfillment_type
                        AS fulfillmentType,

                    delivery_fee
                        AS deliveryFee,

                    items,

                    total_amount
                        AS total,

                    payment_status
                        AS paymentStatus,

                    order_status
                        AS orderStatus,

                    (
                        SELECT delivery_status
                        FROM deliveries
                        WHERE order_id = orders.id
                        ORDER BY id DESC
                        LIMIT 1
                    ) AS deliveryStatus,

                    payment_reference
                        AS paymentReference,

                    created_at
                        AS createdAt,

                    updated_at
                        AS updatedAt

                FROM orders

                WHERE customer_id = ?

                ORDER BY
                    id DESC

            `).all(
                customer.id
            );


        orders.forEach(
            order => {

                parseOrderItems(
                    order
                );

            }
        );


        return res.status(200).json({

            success: true,

            orders

        });


    } catch (error) {

        console.error(
            "❌ Get My Orders Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to load your orders.",

            error:
                error.message

        });

    }

};


// =====================================================
// GET ALL ORDERS
// GET /api/orders
// =====================================================
//
// IMPORTANT:
//
// This endpoint should eventually be removed from
// the public customer route and used only by admin.
//
// Your admin dashboard already has:
//
// GET /api/admin/orders
//
// =====================================================

export const getOrders = (req, res) => {

    try {

        const orders =
            db.prepare(`
                SELECT

                    id,

                    customer_id
                        AS customerId,

                    customer_name
                        AS customerName,

                    customer_phone
                        AS customerPhone,

                    customer_email
                        AS customerEmail,

                    delivery_address
                        AS deliveryAddress,

                    fulfillment_type
                        AS fulfillmentType,

                    delivery_fee
                        AS deliveryFee,

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

            `).all();


        orders.forEach(
            order => {

                parseOrderItems(
                    order
                );

            }
        );


        return res.status(200).json({

            success: true,

            orders

        });


    } catch (error) {

        console.error(
            "❌ Get Orders Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to get orders.",

            error:
                error.message

        });

    }

};


// =====================================================
// GET SINGLE CUSTOMER ORDER
// GET /api/orders/:id
// =====================================================

export const getOrderById = (req, res) => {

    try {

        const orderId =
            Number(
                req.params.id
            );


        if (

            !Number.isInteger(
                orderId
            ) ||

            orderId <= 0

        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please provide a valid order number."

            });

        }


        const customer =
            getAuthenticatedCustomer(req);


        if (!customer) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required. Please login."

            });

        }


        const order =
            getCustomerOrder(

                orderId,

                customer.id

            );


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found."

            });

        }


        parseOrderItems(
            order
        );


        return res.status(200).json({

            success: true,

            order

        });


    } catch (error) {

        console.error(
            "❌ Get Order By ID Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to get order.",

            error:
                error.message

        });

    }

};


// =====================================================
// TRACK ORDER
// GET /api/orders/:id/track?phone=...
// =====================================================
//
// Legacy endpoint retained for compatibility.
//
// =====================================================

export const trackOrder = (req, res) => {

    try {

        const orderId =
            Number(
                req.params.id
            );


        const phone =
            req.query.phone;


        // =================================================
        // VALIDATE ORDER ID
        // =================================================

        if (

            !Number.isInteger(
                orderId
            ) ||

            orderId <= 0

        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please provide a valid order number."

            });

        }


        // =================================================
        // VALIDATE PHONE
        // =================================================

        if (
            !phone ||
            String(phone).trim() === ""
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Phone number is required."

            });

        }


        // =================================================
        // NORMALIZE PHONE
        // =================================================

        const normalizePhone =
            value => {

                let normalized =
                    String(value)
                        .trim()
                        .replace(
                            /[\s\-()]/g,
                            ""
                        );


                if (
                    normalized.startsWith(
                        "+234"
                    )
                ) {

                    normalized =
                        "0" +
                        normalized.slice(4);

                }

                else if (
                    normalized.startsWith(
                        "234"
                    )
                ) {

                    normalized =
                        "0" +
                        normalized.slice(3);

                }


                return normalized;

            };


        const suppliedPhone =
            normalizePhone(
                phone
            );


        // =================================================
        // NIGERIAN PHONE VALIDATION
        // =================================================

        if (
            !/^0\d{10}$/.test(
                suppliedPhone
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter a valid Nigerian phone number."

            });

        }


        // =================================================
        // GET ORDER
        // =================================================

        const order =
            db.prepare(`
                SELECT

                    id,

                    customer_id
                        AS customerId,

                    customer_name
                        AS customerName,

                    customer_phone
                        AS customerPhone,

                    customer_email
                        AS customerEmail,

                    delivery_address
                        AS deliveryAddress,

                    fulfillment_type
                        AS fulfillmentType,

                    delivery_fee
                        AS deliveryFee,

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

                WHERE id = ?

            `).get(
                orderId
            );


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found. Please check your order number and phone number."

            });

        }


        // =================================================
        // VERIFY PHONE
        // =================================================

        const storedPhone =
            normalizePhone(
                order.customerPhone
            );


        if (
            storedPhone !==
            suppliedPhone
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found. Please check your order number and phone number."

            });

        }


        // =================================================
        // PARSE ITEMS
        // =================================================

        parseOrderItems(
            order
        );


        // =================================================
        // REMOVE PRIVATE INFORMATION
        // =================================================

        delete order.customerPhone;

        delete order.customerEmail;


        // =================================================
        // SUCCESS
        // =================================================

        return res.status(200).json({

            success: true,

            message:
                "Order found successfully.",

            order

        });


    } catch (error) {

        console.error(
            "❌ Track Order Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to track order right now.",

            error:
                error.message

        });

    }

};
