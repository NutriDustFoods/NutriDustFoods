import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";


// =====================================================
// DATABASE PATH
// =====================================================

const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);

const dbPath =
    path.join(
        __dirname,
        "../nutridust.db"
    );


// =====================================================
// CONNECT DATABASE
// =====================================================

const db =
    new Database(dbPath);

db.pragma("journal_mode = WAL");

console.log(
    "✅ SQLite database connected"
);



// =====================================================
// PRODUCTS TABLE
// =====================================================

db.exec(`
    CREATE TABLE IF NOT EXISTS products (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        name TEXT NOT NULL,

        category TEXT NOT NULL,

        description TEXT NOT NULL,

        image TEXT NOT NULL,

        price REAL NOT NULL,

        rating REAL DEFAULT 5,

        badge TEXT DEFAULT 'NEW',

        created_at
            DATETIME
            DEFAULT CURRENT_TIMESTAMP,

        updated_at
            DATETIME
            DEFAULT CURRENT_TIMESTAMP

    )
`);

console.log(
    "✅ Products table ready"
);



// =====================================================
// ORDERS TABLE
// =====================================================

db.exec(`
    CREATE TABLE IF NOT EXISTS orders (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        customer_name TEXT NOT NULL,

        customer_phone TEXT NOT NULL,

        customer_email TEXT NOT NULL,

        delivery_address TEXT NOT NULL,

        items TEXT NOT NULL,

        total_amount REAL NOT NULL,

        payment_status
            TEXT DEFAULT 'pending',

        order_status
            TEXT DEFAULT 'pending',

        payment_reference TEXT,

        created_at
            DATETIME
            DEFAULT CURRENT_TIMESTAMP,

        updated_at
            DATETIME
            DEFAULT CURRENT_TIMESTAMP

    )
`);


// =====================================================
// ORDER PAYMENT REFERENCE MIGRATION
// =====================================================

const orderColumns =
    db
        .prepare(
            `PRAGMA table_info(orders)`
        )
        .all();


const hasPaymentReference =
    orderColumns.some(
        column =>
            column.name ===
            "payment_reference"
    );


if (!hasPaymentReference) {

    db.exec(`
        ALTER TABLE orders
        ADD COLUMN payment_reference TEXT
    `);

    console.log(
        "✅ Payment reference column added"
    );

}


console.log(
    "✅ Orders table ready"
);



// =====================================================
// INVENTORY TABLE
// =====================================================
//
// One inventory record belongs to one product.
//
// total_produced
//     Total quantity ever produced.
//
// total_sold
//     Total quantity sold through orders.
//
// quantity_available
//     Current available stock.
//
// reserved_quantity
//     Quantity temporarily reserved for orders.
//
// =====================================================

db.exec(`
    CREATE TABLE IF NOT EXISTS inventory (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        product_id
            INTEGER NOT NULL UNIQUE,

        total_produced
            INTEGER NOT NULL DEFAULT 0,

        total_sold
            INTEGER NOT NULL DEFAULT 0,

        quantity_available
            INTEGER NOT NULL DEFAULT 0,

        reserved_quantity
            INTEGER NOT NULL DEFAULT 0,

        low_stock_threshold
            INTEGER NOT NULL DEFAULT 10,

        created_at
            DATETIME
            DEFAULT CURRENT_TIMESTAMP,

        updated_at
            DATETIME
            DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (product_id)
            REFERENCES products(id)
            ON DELETE CASCADE

    )
`);

console.log(
    "✅ Inventory table ready"
);



// =====================================================
// INVENTORY RESERVED QUANTITY MIGRATION
// =====================================================
//
// Adds reserved_quantity to older databases.
//
// =====================================================

const inventoryColumns =
    db
        .prepare(
            `PRAGMA table_info(inventory)`
        )
        .all();


const hasReservedQuantity =
    inventoryColumns.some(
        column =>
            column.name ===
            "reserved_quantity"
    );


if (!hasReservedQuantity) {

    db.exec(`
        ALTER TABLE inventory
        ADD COLUMN reserved_quantity
        INTEGER NOT NULL DEFAULT 0
    `);

    console.log(
        "✅ Reserved quantity column added"
    );

}



// =====================================================
// INVENTORY MOVEMENTS TABLE
// =====================================================
//
// Permanent audit history.
//
// movement_type:
//
// production
// sale
// adjustment
// return
//
// quantity:
//
// Positive = stock added
// Negative = stock removed
//
// performed_by:
//
// Username of admin who performed
// the action.
//
// Existing old records use SYSTEM.
//
// =====================================================

db.exec(`
    CREATE TABLE IF NOT EXISTS inventory_movements (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        product_id
            INTEGER NOT NULL,

        movement_type
            TEXT NOT NULL,

        quantity
            INTEGER NOT NULL,

        reference_id
            INTEGER,

        note
            TEXT,

        performed_by
            TEXT NOT NULL
            DEFAULT 'SYSTEM',

        created_at
            DATETIME
            DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (product_id)
            REFERENCES products(id)
            ON DELETE CASCADE

    )
`);

console.log(
    "✅ Inventory movements table ready"
);



// =====================================================
// INVENTORY MOVEMENTS - PERFORMED BY MIGRATION
// =====================================================
//
// This is for databases created BEFORE
// performed_by was introduced.
//
// IMPORTANT:
// There is ONLY ONE declaration of
// movementColumns in this file.
//
// =====================================================

const movementColumns =
    db
        .prepare(
            `PRAGMA table_info(inventory_movements)`
        )
        .all();


const hasPerformedBy =
    movementColumns.some(
        column =>
            column.name ===
            "performed_by"
    );


if (!hasPerformedBy) {

    db.exec(`
        ALTER TABLE inventory_movements
        ADD COLUMN performed_by
        TEXT NOT NULL
        DEFAULT 'SYSTEM'
    `);

    console.log(
        "✅ performed_by column added to inventory movements"
    );

}



// =====================================================
// INDEXES
// =====================================================

db.exec(`
    CREATE INDEX IF NOT EXISTS
    idx_inventory_product_id

    ON inventory(product_id)
`);


db.exec(`
    CREATE INDEX IF NOT EXISTS
    idx_inventory_movements_product_id

    ON inventory_movements(product_id)
`);


db.exec(`
    CREATE INDEX IF NOT EXISTS
    idx_inventory_movements_reference_id

    ON inventory_movements(reference_id)
`);


console.log(
    "✅ Inventory indexes ready"
);



// =====================================================
// SYNCHRONIZE EXISTING PRODUCTS
// =====================================================
//
// If a product exists but does not yet have
// an inventory record, create one.
//
// Existing products start at:
//
// Produced = 0
// Sold = 0
// Available = 0
//
// =====================================================

db.exec(`
    INSERT OR IGNORE INTO inventory (

        product_id,

        total_produced,

        total_sold,

        quantity_available,

        reserved_quantity,

        low_stock_threshold

    )

    SELECT

        id,

        0,

        0,

        0,

        0,

        10

    FROM products
`);

console.log(
    "✅ Existing products synchronized with inventory"
);



// =====================================================
// EXPORT DATABASE
// =====================================================

export default db;