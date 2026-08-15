import db from "../config/sqlite.js";

const Inventory = {

    // =====================================================
    // GET CURRENT STOCK FOR ONE PRODUCT
    // =====================================================

    getStock(productId) {

        const result = db.prepare(`
            SELECT
                COALESCE(
                    SUM(quantity),
                    0
                ) AS stock
            FROM inventory_transactions
            WHERE product_id = ?
        `).get(productId);

        return Number(
            result?.stock || 0
        );

    },


    // =====================================================
    // GET TOTAL PRODUCED
    // =====================================================

    getTotalProduced(productId) {

        const result = db.prepare(`
            SELECT
                COALESCE(
                    SUM(quantity),
                    0
                ) AS totalProduced
            FROM inventory_transactions
            WHERE
                product_id = ?
                AND type = 'production'
        `).get(productId);

        return Number(
            result?.totalProduced || 0
        );

    },


    // =====================================================
    // GET TOTAL SOLD
    // =====================================================

    getTotalSold(productId) {

        const result = db.prepare(`
            SELECT
                COALESCE(
                    SUM(ABS(quantity)),
                    0
                ) AS totalSold
            FROM inventory_transactions
            WHERE
                product_id = ?
                AND type = 'sale'
        `).get(productId);

        return Number(
            result?.totalSold || 0
        );

    },


    // =====================================================
    // ADD PRODUCTION
    // =====================================================

    addProduction(
        productId,
        quantity,
        reference = null,
        notes = null
    ) {

        if (
            !Number.isInteger(quantity) ||
            quantity <= 0
        ) {

            throw new Error(
                "Production quantity must be a positive whole number."
            );

        }

        const result = db.prepare(`
            INSERT INTO inventory_transactions (
                product_id,
                type,
                quantity,
                reference,
                notes
            )
            VALUES (?, 'production', ?, ?, ?)
        `).run(
            productId,
            quantity,
            reference,
            notes
        );

        return result.lastInsertRowid;

    },


    // =====================================================
    // RECORD SALE
    // =====================================================

    recordSale(
        productId,
        quantity,
        reference = null,
        notes = null
    ) {

        if (
            !Number.isInteger(quantity) ||
            quantity <= 0
        ) {

            throw new Error(
                "Sale quantity must be a positive whole number."
            );

        }

        const result = db.prepare(`
            INSERT INTO inventory_transactions (
                product_id,
                type,
                quantity,
                reference,
                notes
            )
            VALUES (?, 'sale', ?, ?, ?)
        `).run(
            productId,
            -quantity,
            reference,
            notes
        );

        return result.lastInsertRowid;

    },


    // =====================================================
    // ADJUST INVENTORY
    // =====================================================

    adjust(
        productId,
        quantity,
        reference = null,
        notes = null
    ) {

        if (
            !Number.isInteger(quantity) ||
            quantity === 0
        ) {

            throw new Error(
                "Adjustment must be a non-zero whole number."
            );

        }

        const result = db.prepare(`
            INSERT INTO inventory_transactions (
                product_id,
                type,
                quantity,
                reference,
                notes
            )
            VALUES (?, 'adjustment', ?, ?, ?)
        `).run(
            productId,
            quantity,
            reference,
            notes
        );

        return result.lastInsertRowid;

    },


    // =====================================================
    // GET INVENTORY SUMMARY
    // =====================================================

    getSummary(productId) {

        const product = db.prepare(`
            SELECT
                id,
                name,
                price,
                image
            FROM products
            WHERE id = ?
        `).get(productId);


        if (!product) {

            return null;

        }


        const totalProduced =
            this.getTotalProduced(
                productId
            );


        const totalSold =
            this.getTotalSold(
                productId
            );


        const stock =
            this.getStock(
                productId
            );


        return {

            productId:
                product.id,

            name:
                product.name,

            price:
                product.price,

            image:
                product.image,

            totalProduced,

            totalSold,

            available:
                stock

        };

    },


    // =====================================================
    // GET ALL INVENTORY
    // =====================================================

    getAll() {

        const products = db.prepare(`
            SELECT
                id,
                name,
                category,
                price,
                image
            FROM products
            ORDER BY id ASC
        `).all();


        return products.map(
            product => {

                const totalProduced =
                    this.getTotalProduced(
                        product.id
                    );


                const totalSold =
                    this.getTotalSold(
                        product.id
                    );


                const available =
                    this.getStock(
                        product.id
                    );


                return {

                    productId:
                        product.id,

                    name:
                        product.name,

                    category:
                        product.category,

                    price:
                        product.price,

                    image:
                        product.image,

                    totalProduced,

                    totalSold,

                    available

                };

            }
        );

    },


    // =====================================================
    // GET TRANSACTION HISTORY
    // =====================================================

    getHistory(productId) {

        return db.prepare(`
            SELECT
                id,
                product_id AS productId,
                type,
                quantity,
                reference,
                notes,
                created_at AS createdAt
            FROM inventory_transactions
            WHERE product_id = ?
            ORDER BY id DESC
        `).all(productId);

    }

};

export default Inventory;