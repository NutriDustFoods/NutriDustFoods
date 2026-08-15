import db from "../config/sqlite.js";


// =====================================================
// HELPER: GET ADMIN / USER WHO PERFORMED THE ACTION
// =====================================================

function getPerformedBy(req) {

    const admin = req.admin || {};

    return (
        admin.username ||
        admin.name ||
        admin.email ||
        admin.adminName ||
        admin.userName ||
        (admin.id ? `Admin #${admin.id}` : null) ||
        "SYSTEM"
    );

}


// =====================================================
// HELPER: FORMAT DATABASE UTC TIMESTAMP
//
// SQLite CURRENT_TIMESTAMP stores UTC as:
// YYYY-MM-DD HH:MM:SS
//
// We convert it to:
// YYYY-MM-DDTHH:MM:SSZ
//
// The frontend can then correctly convert it to
// Africa/Lagos local time.
// =====================================================

function toUtcIso(value) {

    if (!value) {

        return null;

    }


    const stringValue =
        String(value).trim();


    if (!stringValue) {

        return null;

    }


    // Already ISO UTC

    if (
        stringValue.endsWith("Z")
    ) {

        return stringValue;

    }


    // SQLite format:
    // 2026-08-15 08:38:55

    if (
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/
            .test(stringValue)
    ) {

        return (
            stringValue.replace(
                " ",
                "T"
            ) + "Z"
        );

    }


    // Fallback

    const parsed =
        new Date(stringValue);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return stringValue;

    }


    return parsed.toISOString();

}


// =====================================================
// HELPER: FORMAT INVENTORY RECORD
// =====================================================

function formatInventory(item) {

    if (!item) {

        return null;

    }


    return {

        ...item,

        createdAt:
            toUtcIso(
                item.createdAt
            ),

        updatedAt:
            toUtcIso(
                item.updatedAt
            ),

        totalProduced:
            Number(
                item.totalProduced || 0
            ),

        totalSold:
            Number(
                item.totalSold || 0
            ),

        quantityAvailable:
            Number(
                item.quantityAvailable || 0
            ),

        reservedQuantity:
            Number(
                item.reservedQuantity || 0
            ),

        lowStockThreshold:
            Number(
                item.lowStockThreshold || 10
            ),

        isLowStock:
            Number(
                item.quantityAvailable || 0
            ) <=
            Number(
                item.lowStockThreshold || 10
            ),

        isOutOfStock:
            Number(
                item.quantityAvailable || 0
            ) <= 0

    };

}


// =====================================================
// GET INVENTORY
// GET /api/admin/inventory
// =====================================================

export const getInventory = (req, res) => {

    try {

        const inventory =
            db.prepare(`

                SELECT

                    inventory.id,

                    inventory.product_id
                        AS productId,

                    products.name,

                    products.category,

                    products.image,

                    products.price,

                    inventory.total_produced
                        AS totalProduced,

                    inventory.total_sold
                        AS totalSold,

                    inventory.quantity_available
                        AS quantityAvailable,

                    inventory.reserved_quantity
                        AS reservedQuantity,

                    inventory.low_stock_threshold
                        AS lowStockThreshold,

                    inventory.created_at
                        AS createdAt,

                    inventory.updated_at
                        AS updatedAt

                FROM inventory

                INNER JOIN products

                    ON products.id =
                        inventory.product_id

                ORDER BY
                    products.name ASC

            `).all();


        const formattedInventory =
            inventory.map(
                formatInventory
            );


        return res.status(200).json({

            success: true,

            inventory:
                formattedInventory

        });


    } catch (error) {

        console.error(
            "❌ Get Inventory Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to load inventory.",

            error:
                error.message

        });

    }

};


// =====================================================
// ADD PRODUCTION
// POST /api/admin/inventory/:productId/production
// =====================================================

export const addProduction = (req, res) => {

    try {

        const productId =
            Number(
                req.params.productId
            );


        const quantity =
            Number(
                req.body.quantity
            );


        const note =
            String(
                req.body.note || ""
            ).trim();


        const performedBy =
            getPerformedBy(req);


        // -------------------------------------------------
        // VALIDATE PRODUCT ID
        // -------------------------------------------------

        if (
            !Number.isInteger(productId) ||
            productId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid product ID."

            });

        }


        // -------------------------------------------------
        // VALIDATE QUANTITY
        // -------------------------------------------------

        if (
            !Number.isInteger(quantity) ||
            quantity <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Production quantity must be a positive whole number."

            });

        }


        // -------------------------------------------------
        // CHECK PRODUCT
        // -------------------------------------------------

        const product =
            db.prepare(`

                SELECT
                    id,
                    name

                FROM products

                WHERE id = ?

            `).get(productId);


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found."

            });

        }


        // -------------------------------------------------
        // TRANSACTION
        // -------------------------------------------------

        const transaction =
            db.transaction(() => {

                // -----------------------------------------
                // CREATE INVENTORY IF MISSING
                // -----------------------------------------

                db.prepare(`

                    INSERT OR IGNORE INTO inventory (

                        product_id,

                        total_produced,

                        total_sold,

                        quantity_available,

                        reserved_quantity,

                        low_stock_threshold

                    )

                    VALUES (

                        ?,

                        0,

                        0,

                        0,

                        0,

                        10

                    )

                `).run(
                    productId
                );


                // -----------------------------------------
                // UPDATE INVENTORY
                // -----------------------------------------

                db.prepare(`

                    UPDATE inventory

                    SET

                        total_produced =
                            total_produced + ?,

                        quantity_available =
                            quantity_available + ?,

                        updated_at =
                            CURRENT_TIMESTAMP

                    WHERE product_id = ?

                `).run(

                    quantity,

                    quantity,

                    productId

                );


                // -----------------------------------------
                // RECORD MOVEMENT
                // -----------------------------------------

                db.prepare(`

                    INSERT INTO inventory_movements (

                        product_id,

                        movement_type,

                        quantity,

                        reference_id,

                        note,

                        performed_by,

                        created_at

                    )

                    VALUES (

                        ?,

                        ?,

                        ?,

                        ?,

                        ?,

                        ?,

                        CURRENT_TIMESTAMP

                    )

                `).run(

                    productId,

                    "production",

                    quantity,

                    null,

                    note ||
                    `Production of ${quantity} unit(s)`,

                    performedBy

                );

            });


        transaction();


        // -------------------------------------------------
        // GET UPDATED INVENTORY
        // -------------------------------------------------

        const updated =
            db.prepare(`

                SELECT

                    inventory.id,

                    inventory.product_id
                        AS productId,

                    products.name,

                    products.category,

                    products.image,

                    products.price,

                    inventory.total_produced
                        AS totalProduced,

                    inventory.total_sold
                        AS totalSold,

                    inventory.quantity_available
                        AS quantityAvailable,

                    inventory.reserved_quantity
                        AS reservedQuantity,

                    inventory.low_stock_threshold
                        AS lowStockThreshold,

                    inventory.created_at
                        AS createdAt,

                    inventory.updated_at
                        AS updatedAt

                FROM inventory

                INNER JOIN products

                    ON products.id =
                        inventory.product_id

                WHERE inventory.product_id = ?

            `).get(productId);


        return res.status(200).json({

            success: true,

            message:
                "Production quantity added successfully.",

            inventory:
                formatInventory(updated)

        });


    } catch (error) {

        console.error(
            "❌ Add Production Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to add production quantity.",

            error:
                error.message

        });

    }

};


// =====================================================
// ADJUST INVENTORY
// PATCH /api/admin/inventory/:productId/adjust
// =====================================================

export const adjustInventory = (req, res) => {

    try {

        const productId =
            Number(
                req.params.productId
            );


        const quantity =
            Number(
                req.body.quantity
            );


        const note =
            String(
                req.body.note || ""
            ).trim();


        const performedBy =
            getPerformedBy(req);


        // -------------------------------------------------
        // VALIDATE PRODUCT ID
        // -------------------------------------------------

        if (
            !Number.isInteger(productId) ||
            productId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid product ID."

            });

        }


        // -------------------------------------------------
        // VALIDATE QUANTITY
        // -------------------------------------------------

        if (
            !Number.isInteger(quantity) ||
            quantity === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Adjustment quantity cannot be zero."

            });

        }


        // -------------------------------------------------
        // VALIDATE NOTE
        // -------------------------------------------------

        if (!note) {

            return res.status(400).json({

                success: false,

                message:
                    "Adjustment reason is required."

            });

        }


        // -------------------------------------------------
        // GET INVENTORY
        // -------------------------------------------------

        const inventory =
            db.prepare(`

                SELECT *

                FROM inventory

                WHERE product_id = ?

            `).get(productId);


        if (!inventory) {

            return res.status(404).json({

                success: false,

                message:
                    "Inventory record not found."

            });

        }


        // -------------------------------------------------
        // CURRENT AVAILABLE
        // -------------------------------------------------

        const currentAvailable =
            Number(
                inventory.quantity_available
            );


        // -------------------------------------------------
        // NEW AVAILABLE
        // -------------------------------------------------

        const newAvailable =
            currentAvailable +
            quantity;


        if (newAvailable < 0) {

            return res.status(400).json({

                success: false,

                message:
                    "Adjustment would make inventory negative.",

                currentQuantity:
                    currentAvailable,

                requestedAdjustment:
                    quantity

            });

        }


        // -------------------------------------------------
        // TRANSACTION
        // -------------------------------------------------

        const transaction =
            db.transaction(() => {

                // -----------------------------------------
                // UPDATE AVAILABLE
                // -----------------------------------------

                db.prepare(`

                    UPDATE inventory

                    SET

                        quantity_available =
                            quantity_available + ?,

                        updated_at =
                            CURRENT_TIMESTAMP

                    WHERE product_id = ?

                `).run(

                    quantity,

                    productId

                );


                // -----------------------------------------
                // KEEP PRODUCTION BALANCE
                // -----------------------------------------

                db.prepare(`

                    UPDATE inventory

                    SET

                        total_produced =
                            total_produced + ?,

                        updated_at =
                            CURRENT_TIMESTAMP

                    WHERE product_id = ?

                `).run(

                    quantity,

                    productId

                );


                // -----------------------------------------
                // RECORD MOVEMENT
                // -----------------------------------------

                db.prepare(`

                    INSERT INTO inventory_movements (

                        product_id,

                        movement_type,

                        quantity,

                        reference_id,

                        note,

                        performed_by,

                        created_at

                    )

                    VALUES (

                        ?,

                        ?,

                        ?,

                        ?,

                        ?,

                        ?,

                        CURRENT_TIMESTAMP

                    )

                `).run(

                    productId,

                    "adjustment",

                    quantity,

                    null,

                    note,

                    performedBy

                );

            });


        transaction();


        // -------------------------------------------------
        // GET UPDATED INVENTORY
        // -------------------------------------------------

        const updated =
            db.prepare(`

                SELECT

                    inventory.id,

                    inventory.product_id
                        AS productId,

                    products.name,

                    products.category,

                    products.image,

                    products.price,

                    inventory.total_produced
                        AS totalProduced,

                    inventory.total_sold
                        AS totalSold,

                    inventory.quantity_available
                        AS quantityAvailable,

                    inventory.reserved_quantity
                        AS reservedQuantity,

                    inventory.low_stock_threshold
                        AS lowStockThreshold,

                    inventory.created_at
                        AS createdAt,

                    inventory.updated_at
                        AS updatedAt

                FROM inventory

                INNER JOIN products

                    ON products.id =
                        inventory.product_id

                WHERE inventory.product_id = ?

            `).get(productId);


        return res.status(200).json({

            success: true,

            message:
                "Inventory adjusted successfully.",

            inventory:
                formatInventory(updated)

        });


    } catch (error) {

        console.error(
            "❌ Adjust Inventory Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to adjust inventory.",

            error:
                error.message

        });

    }

};


// =====================================================
// GET INVENTORY MOVEMENT HISTORY
// GET /api/admin/inventory/:productId/history
// =====================================================

export const getInventoryHistory = (req, res) => {

    try {

        const productId =
            Number(
                req.params.productId
            );


        // -------------------------------------------------
        // VALIDATE PRODUCT ID
        // -------------------------------------------------

        if (
            !Number.isInteger(productId) ||
            productId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid product ID."

            });

        }


        // -------------------------------------------------
        // CHECK PRODUCT
        // -------------------------------------------------

        const product =
            db.prepare(`

                SELECT

                    id,

                    name

                FROM products

                WHERE id = ?

            `).get(productId);


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found."

            });

        }


        // -------------------------------------------------
        // GET MOVEMENTS
        //
        // IMPORTANT:
        // created_at is UTC in SQLite.
        // We explicitly convert it to ISO UTC
        // before sending it to frontend.
        // -------------------------------------------------

        const movements =
            db.prepare(`

                SELECT

                    id,

                    product_id
                        AS productId,

                    movement_type
                        AS movementType,

                    quantity,

                    reference_id
                        AS referenceId,

                    note,

                    performed_by
                        AS performedBy,

                    created_at
                        AS createdAt

                FROM inventory_movements

                WHERE product_id = ?

                ORDER BY
                    id DESC

            `).all(productId);


        const formattedMovements =
            movements.map(
                movement => ({

                    ...movement,

                    quantity:
                        Number(
                            movement.quantity
                        ),

                    createdAt:
                        toUtcIso(
                            movement.createdAt
                        ),

                    performedBy:
                        movement.performedBy ||
                        "SYSTEM"

                })
            );


        return res.status(200).json({

            success: true,

            product,

            movements:
                formattedMovements

        });


    } catch (error) {

        console.error(
            "❌ Inventory History Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to load inventory history.",

            error:
                error.message

        });

    }

};