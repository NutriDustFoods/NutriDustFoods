import db from "../config/sqlite.js";

const Product = {
    getAll() {
        return db
            .prepare(`
                SELECT
                    id,
                    name,
                    category,
                    description,
                    image,
                    price,
                    rating,
                    badge,
                    created_at AS createdAt,
                    updated_at AS updatedAt
                FROM products
                ORDER BY id ASC
            `)
            .all();
    },

    getById(id) {
        return db
            .prepare(`
                SELECT
                    id,
                    name,
                    category,
                    description,
                    image,
                    price,
                    rating,
                    badge,
                    created_at AS createdAt,
                    updated_at AS updatedAt
                FROM products
                WHERE id = ?
            `)
            .get(id);
    },

    create(product) {
        const statement = db.prepare(`
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

        const result = statement.run(
            product.name,
            product.category,
            product.description,
            product.image,
            product.price,
            product.rating ?? 5,
            product.badge ?? "NEW"
        );

        return this.getById(result.lastInsertRowid);
    },

    deleteAll() {
        return db.prepare(`DELETE FROM products`).run();
    }
};

export default Product;