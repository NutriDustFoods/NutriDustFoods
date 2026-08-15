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

                    (
                    COALESCE(inventory.total_produced, 0) -
                    COALESCE(inventory.total_sold, 0)
                    ) AS quantityAvailable,

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

                    products.created_at AS createdAt,
                    products.updated_at AS updatedAt

                FROM products

                LEFT JOIN inventory
                    ON inventory.product_id = products.id

                ORDER BY products.id ASC
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

                    products.created_at AS createdAt,
                    products.updated_at AS updatedAt

                FROM products

                LEFT JOIN inventory
                    ON inventory.product_id = products.id

                WHERE products.id = ?
            `)
            .get(id);

    },


    // =====================================================
    // CREATE PRODUCT
    // =====================================================

    create(product) {

        const statement =
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
            `);


        const result =
            statement.run(

                product.name,
                product.category,
                product.description,
                product.image,
                product.price,
                product.rating ?? 5,
                product.badge ?? "NEW"

            );


        // Create inventory record for new product

        db.prepare(`
            INSERT OR IGNORE INTO inventory (
                product_id,
                total_produced,
                total_sold,
                quantity_available,
                low_stock_threshold
            )
            VALUES (?, 0, 0, 0, 10)
        `).run(
            result.lastInsertRowid
        );


        return this.getById(
            result.lastInsertRowid
        );

    },


    // =====================================================
    // UPDATE PRODUCT
    // =====================================================

    update(id, product) {

        const statement =
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
                    updated_at = CURRENT_TIMESTAMP

                WHERE id = ?
            `);


        statement.run(

            product.name,
            product.category,
            product.description,
            product.image,
            product.price,
            product.rating ?? 5,
            product.badge ?? "NEW",
            id

        );


        return this.getById(id);

    },


    // =====================================================
    // DELETE PRODUCT
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