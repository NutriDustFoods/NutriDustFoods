import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "../nutridust.db");

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

console.log("✅ SQLite database connected");


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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

console.log("✅ Products table ready");


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
        payment_status TEXT DEFAULT 'pending',
        order_status TEXT DEFAULT 'pending',
        payment_reference TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);


// =====================================================
// ADD PAYMENT REFERENCE TO EXISTING DATABASES
// =====================================================

const orderColumns = db
    .prepare(`PRAGMA table_info(orders)`)
    .all();

const hasPaymentReference =
    orderColumns.some(
        column => column.name === "payment_reference"
    );


if (!hasPaymentReference) {

    db.exec(`
        ALTER TABLE orders
        ADD COLUMN payment_reference TEXT
    `);

    console.log("✅ Payment reference column added");

}


console.log("✅ Orders table ready");


export default db;