import db from "../config/sqlite.js";


const Product = {

    // =====================================================
    // GET ALL PRODUCTS
    // =====================================================

    getAll() {

        return db
            .prepare(`
                SELECT
                    products.id,

                    products.name,

                    products.category,

                    products.description,

                    products.image,

                    products.price,

                    products.rating,

                    products.badge,

                    COALESCE(
                        inventory.quantity_available,
                        0
                    ) AS quantityAvailable,

                    COALESCE(
                        inventory.reserved_quantity,
                        0
                    ) AS reservedQuantity,

                    COALESCE(
                        inventory.total_produced,
                        0
                    ) AS totalProduced,

                    COALESCE(
                        inventory.total_sold,
                        0
                    ) AS totalSold,

                    COALESCE(
                        inventory.low_stock_threshold,
                        10
                    ) AS lowStockThreshold,

                    products.created_at
                        AS createdAt,

                    products.updated_at
                        AS updatedAt

                FROM products

                LEFT JOIN inventory
                    ON inventory.product_id =
                       products.id

                ORDER BY
                    products.id ASC
            `)
            .all();

    },


    // =====================================================
    // GET PRODUCT BY ID
    // =====================================================

    getById(id) {

        return db
            .prepare(`
                SELECT
                    products.id,

                    products.name,

                    products.category,

                    products.description,

                    products.image,

                    products.price,

                    products.rating,

                    products.badge,

                    COALESCE(
                        inventory.quantity_available,
                        0
                    ) AS quantityAvailable,

                    COALESCE(
                        inventory.reserved_quantity,
                        0
                    ) AS reservedQuantity,

                    COALESCE(
                        inventory.total_produced,
                        0
                    ) AS totalProduced,

                    COALESCE(
                        inventory.total_sold,
                        0
                    ) AS totalSold,

                    COALESCE(
                        inventory.low_stock_threshold,
                        10
                    ) AS lowStockThreshold,

                    products.created_at
                        AS createdAt,

                    products.updated_at
                        AS updatedAt

                FROM products

                LEFT JOIN inventory
                    ON inventory.product_id =
                       products.id

                WHERE products.id = ?
            `)
            .get(id);

    },


    // =====================================================
    // CREATE PRODUCT
    // =====================================================

    create(product) {

        const transaction =
            db.transaction(() => {

                // =========================================
                // CREATE PRODUCT
                // =========================================

                const result =
                    db.prepare(`
                        INSERT INTO products (
                            name,
                            category,
                            description,
                            image,
                            price,
                            rating,
                            badge
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    `).run(

                        product.name,

                        product.category,

                        product.description,

                        product.image,

                        Number(
                            product.price
                        ),

                        product.rating ??
                            5,

                        product.badge ??
                            "NEW"

                    );


                const productId =
                    result.lastInsertRowid;


                // =========================================
                // CREATE INVENTORY
                // =========================================

                db.prepare(`
                    INSERT INTO inventory (
                        product_id,
                        total_produced,
                        total_sold,
                        quantity_available,
                        reserved_quantity,
                        low_stock_threshold
                    )
                    VALUES (?, 0, 0, 0, 0, 10)
                `).run(
                    productId
                );


                return productId;

            });


        const productId =
            transaction();


        return this.getById(
            productId
        );

    },


    // =====================================================
    // UPDATE PRODUCT
    // =====================================================

    update(id, product) {

        const existing =
            this.getById(id);


        if (!existing) {

            return null;

        }


        db.prepare(`
            UPDATE products

            SET
                name = ?,

                category = ?,

                description = ?,

                image = ?,

                price = ?,

                rating = ?,

                badge = ?,

                updated_at =
                    CURRENT_TIMESTAMP

            WHERE id = ?
        `).run(

            product.name,

            product.category,

            product.description,

            product.image,

            Number(
                product.price
            ),

            product.rating ??
                5,

            product.badge ??
                "NEW",

            id

        );


        return this.getById(
            id
        );

    },


    // =====================================================
    // DELETE PRODUCT BY ID
    // =====================================================

    deleteById(id) {

        return db
            .prepare(`
                DELETE FROM products
                WHERE id = ?
            `)
            .run(id);

    },


    // =====================================================
    // DELETE ALL PRODUCTS
    // =====================================================

    deleteAll() {

        return db
            .prepare(`
                DELETE FROM products
            `)
            .run();

    }

};


export default Product;