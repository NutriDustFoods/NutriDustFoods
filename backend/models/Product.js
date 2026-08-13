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

    update(id, product) {

    const statement = db.prepare(`
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


deleteById(id) {

    return db
        .prepare(
            `DELETE FROM products WHERE id = ?`
        )
        .run(id);

},


deleteAll() {
        return db.prepare(`DELETE FROM products`).run();
    }
};

export default Product;