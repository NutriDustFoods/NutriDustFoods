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
    process.env.SQLITE_PATH
        ? path.resolve(process.env.SQLITE_PATH)
        : path.join(__dirname, "../nutridust.db");


// =====================================================
// CONNECT DATABASE
// =====================================================

const db =
    new Database(dbPath);


// =====================================================
// SQLITE SETTINGS
// =====================================================

db.pragma(
    "journal_mode = WAL"
);

db.pragma(
    "foreign_keys = ON"
);


console.log(
    "✅ SQLite database connected"
);


// =====================================================
// PRODUCTS TABLE
// =====================================================

db.exec(`
    CREATE TABLE IF NOT EXISTS products (

        id
            INTEGER
            PRIMARY KEY
            AUTOINCREMENT,

        name
            TEXT
            NOT NULL,

        category
            TEXT
            NOT NULL,

        description
            TEXT
            NOT NULL,

        image
            TEXT
            NOT NULL,

        price
            REAL
            NOT NULL,

        rating
            REAL
            DEFAULT 5,

        badge
            TEXT
            DEFAULT 'NEW',

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
// CUSTOMERS TABLE
// =====================================================
//
// password_hash contains ONLY the bcrypt hash.
//
// Never store plain-text passwords.
//
// =====================================================

db.exec(`
    CREATE TABLE IF NOT EXISTS customers (

        id
            INTEGER
            PRIMARY KEY
            AUTOINCREMENT,

        name
            TEXT
            NOT NULL,

        email
            TEXT
            NOT NULL
            UNIQUE,

        phone
            TEXT
            NOT NULL,

        password_hash
            TEXT
            NOT NULL,

        created_at
            DATETIME
            DEFAULT CURRENT_TIMESTAMP,

        updated_at
            DATETIME
            DEFAULT CURRENT_TIMESTAMP

    )
`);

console.log(
    "✅ Customers table ready"
);


// =====================================================
// CUSTOMER INDEXES
// =====================================================

db.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS
    idx_customers_email
    ON customers(email)
`);

db.exec(`
    CREATE INDEX IF NOT EXISTS
    idx_customers_phone
    ON customers(phone)
`);

console.log(
    "✅ Customer indexes ready"
);


// =====================================================
// ORDERS TABLE
// =====================================================
//
// IMPORTANT:
//
// customer_id is intentionally nullable because old
// orders may exist before customer authentication was
// introduced.
//
// New authenticated orders MUST contain customer_id.
//
// =====================================================

db.exec(`
    CREATE TABLE IF NOT EXISTS orders (

        id
            INTEGER
            PRIMARY KEY
            AUTOINCREMENT,

        customer_id
            INTEGER,

        customer_name
            TEXT
            NOT NULL,

        customer_phone
            TEXT
            NOT NULL,

        customer_email
            TEXT
            NOT NULL,

        delivery_address
            TEXT
            NOT NULL,

        items
            TEXT
            NOT NULL,

        total_amount
            REAL
            NOT NULL,

        payment_status
            TEXT
            DEFAULT 'pending',

        order_status
            TEXT
            DEFAULT 'pending',

        payment_reference
            TEXT,

        created_at
            DATETIME
            DEFAULT CURRENT_TIMESTAMP,

        updated_at
            DATETIME
            DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (
            customer_id
        )
        REFERENCES customers(id)
        ON DELETE SET NULL

    )
`);

console.log(
    "✅ Orders table ready"
);


// =====================================================
// ORDERS MIGRATION
// =====================================================
//
// Existing installations may already have an orders
// table without customer_id or payment_reference.
//
// We detect missing columns and add them safely.
//
// =====================================================

const orderColumns =
    db.prepare(`
        PRAGMA table_info(orders)
    `).all();


// =====================================================
// CUSTOMER ID MIGRATION
// =====================================================

const hasCustomerId =
    orderColumns.some(
        column =>
            column.name ===
            "customer_id"
    );


if (!hasCustomerId) {

    db.exec(`
        ALTER TABLE orders

        ADD COLUMN
            customer_id
            INTEGER
    `);

    console.log(
        "✅ customer_id column added to orders"
    );

}


// =====================================================
// PAYMENT REFERENCE MIGRATION
// =====================================================

const refreshedOrderColumns =
    db.prepare(`
        PRAGMA table_info(orders)
    `).all();


const hasPaymentReference =
    refreshedOrderColumns.some(
        column =>
            column.name ===
            "payment_reference"
    );


if (!hasPaymentReference) {

    db.exec(`
        ALTER TABLE orders

        ADD COLUMN
            payment_reference
            TEXT
    `);

    console.log(
        "✅ payment_reference column added to orders"
    );

}


// =====================================================
// ORDER INDEXES
// =====================================================

db.exec(`
    CREATE INDEX IF NOT EXISTS
    idx_orders_customer_id

    ON orders(customer_id)
`);

db.exec(`
    CREATE INDEX IF NOT EXISTS
    idx_orders_payment_reference

    ON orders(payment_reference)
`);

db.exec(`
    CREATE INDEX IF NOT EXISTS
    idx_orders_payment_status

    ON orders(payment_status)
`);

db.exec(`
    CREATE INDEX IF NOT EXISTS
    idx_orders_order_status

    ON orders(order_status)
`);

console.log(
    "✅ Order indexes ready"
);


// =====================================================
// INVENTORY TABLE
// =====================================================

db.exec(`
    CREATE TABLE IF NOT EXISTS inventory (

        id
            INTEGER
            PRIMARY KEY
            AUTOINCREMENT,

        product_id
            INTEGER
            NOT NULL
            UNIQUE,

        total_produced
            INTEGER
            NOT NULL
            DEFAULT 0,

        total_sold
            INTEGER
            NOT NULL
            DEFAULT 0,

        quantity_available
            INTEGER
            NOT NULL
            DEFAULT 0,

        reserved_quantity
            INTEGER
            NOT NULL
            DEFAULT 0,

        low_stock_threshold
            INTEGER
            NOT NULL
            DEFAULT 10,

        created_at
            DATETIME
            DEFAULT CURRENT_TIMESTAMP,

        updated_at
            DATETIME
            DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (
            product_id
        )
        REFERENCES products(id)
        ON DELETE CASCADE

    )
`);

console.log(
    "✅ Inventory table ready"
);


// =====================================================
// INVENTORY MIGRATION
// =====================================================

const inventoryColumns =
    db.prepare(`
        PRAGMA table_info(inventory)
    `).all();


const hasReservedQuantity =
    inventoryColumns.some(
        column =>
            column.name ===
            "reserved_quantity"
    );


if (!hasReservedQuantity) {

    db.exec(`
        ALTER TABLE inventory

        ADD COLUMN
            reserved_quantity
            INTEGER
            NOT NULL
            DEFAULT 0
    `);

    console.log(
        "✅ reserved_quantity column added"
    );

}


// =====================================================
// INVENTORY INDEX
// =====================================================

db.exec(`
    CREATE INDEX IF NOT EXISTS
    idx_inventory_product_id

    ON inventory(product_id)
`);

console.log(
    "✅ Inventory indexes ready"
);


// =====================================================
// INVENTORY MOVEMENTS TABLE
// =====================================================

db.exec(`
    CREATE TABLE IF NOT EXISTS inventory_movements (

        id
            INTEGER
            PRIMARY KEY
            AUTOINCREMENT,

        product_id
            INTEGER
            NOT NULL,

        movement_type
            TEXT
            NOT NULL,

        quantity
            INTEGER
            NOT NULL,

        reference_id
            INTEGER,

        note
            TEXT,

        performed_by
            TEXT
            NOT NULL
            DEFAULT 'SYSTEM',

        created_at
            DATETIME
            DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (
            product_id
        )
        REFERENCES products(id)
        ON DELETE CASCADE

    )
`);

console.log(
    "✅ Inventory movements table ready"
);


// =====================================================
// INVENTORY MOVEMENTS MIGRATION
// =====================================================

const movementColumns =
    db.prepare(`
        PRAGMA table_info(
            inventory_movements
        )
    `).all();


const hasPerformedBy =
    movementColumns.some(
        column =>
            column.name ===
            "performed_by"
    );


if (!hasPerformedBy) {

    db.exec(`
        ALTER TABLE inventory_movements

        ADD COLUMN
            performed_by
            TEXT
            NOT NULL
            DEFAULT 'SYSTEM'
    `);

    console.log(
        "✅ performed_by column added"
    );

}


// =====================================================
// INVENTORY MOVEMENT INDEXES
// =====================================================

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

db.exec(`
    CREATE INDEX IF NOT EXISTS
    idx_inventory_movements_type

    ON inventory_movements(movement_type)
`);

console.log(
    "✅ Inventory movement indexes ready"
);


// =====================================================
// SYNCHRONIZE PRODUCTS WITH INVENTORY
// =====================================================
//
// Every product should have an inventory record.
//
// New products automatically receive:
//
// total_produced      = 0
// total_sold          = 0
// quantity_available  = 0
// reserved_quantity   = 0
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
// DATABASE HEALTH CHECK
// =====================================================

// =====================================================
// RIDERS / DELIVERIES
// =====================================================

db.exec(`
    CREATE TABLE IF NOT EXISTS riders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL UNIQUE,
        email TEXT UNIQUE,
        password_hash TEXT NOT NULL,
        profile_photo TEXT,
        vehicle_type TEXT,
        vehicle_registration_number TEXT,
        availability_status TEXT NOT NULL DEFAULT 'available',
        account_status TEXT NOT NULL DEFAULT 'active',
        total_deliveries INTEGER NOT NULL DEFAULT 0,
        successful_deliveries INTEGER NOT NULL DEFAULT 0,
        failed_deliveries INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS deliveries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL UNIQUE,
        rider_id INTEGER,
        customer_id INTEGER,
        delivery_status TEXT NOT NULL DEFAULT 'awaiting_assignment',
        delivery_address TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        assigned_at DATETIME,
        accepted_at DATETIME,
        picked_up_at DATETIME,
        out_for_delivery_at DATETIME,
        delivered_at DATETIME,
        failed_at DATETIME,
        delivery_note TEXT,
        failure_reason TEXT,
        delivery_pin_hash TEXT,
        delivery_pin_verified_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY(rider_id) REFERENCES riders(id) ON DELETE SET NULL,
        FOREIGN KEY(customer_id) REFERENCES customers(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS delivery_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        delivery_id INTEGER NOT NULL,
        order_id INTEGER NOT NULL,
        actor_type TEXT NOT NULL,
        actor_id INTEGER,
        from_status TEXT,
        to_status TEXT NOT NULL,
        note TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(delivery_id) REFERENCES deliveries(id) ON DELETE CASCADE,
        FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_riders_availability ON riders(availability_status);
    CREATE INDEX IF NOT EXISTS idx_riders_account_status ON riders(account_status);
    CREATE INDEX IF NOT EXISTS idx_deliveries_rider_id ON deliveries(rider_id);
    CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries(delivery_status);
    CREATE INDEX IF NOT EXISTS idx_delivery_events_delivery_id ON delivery_events(delivery_id);
`);

// Additive rider migrations. These are deliberately backward-compatible with
// databases created by earlier NutriDust builds.
const ensureColumn = (table, column, definition) => {
    const exists = db.prepare(`PRAGMA table_info(${table})`).all()
        .some(info => info.name === column);
    if (!exists) db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
};

ensureColumn("riders", "current_latitude", "REAL");
ensureColumn("riders", "current_longitude", "REAL");
ensureColumn("riders", "last_location_at", "DATETIME");
ensureColumn("riders", "wallet_balance", "REAL NOT NULL DEFAULT 0");
ensureColumn("riders", "total_earnings", "REAL NOT NULL DEFAULT 0");
ensureColumn("riders", "referral_code", "TEXT");
ensureColumn("riders", "referred_by_rider_id", "INTEGER");
ensureColumn("riders", "bank_name", "TEXT");
ensureColumn("riders", "bank_account_name", "TEXT");
ensureColumn("riders", "bank_account_number", "TEXT");
ensureColumn("deliveries", "delivery_fee", "REAL NOT NULL DEFAULT 0");
ensureColumn("deliveries", "proof_photo", "TEXT");
ensureColumn("orders", "fulfillment_type", "TEXT NOT NULL DEFAULT 'delivery'");
ensureColumn("orders", "delivery_fee", "REAL NOT NULL DEFAULT 0");
ensureColumn("orders", "delivery_distance_meters", "INTEGER");
ensureColumn("orders", "auto_dispatch_eligible", "INTEGER NOT NULL DEFAULT 0");

db.exec(`
    CREATE TABLE IF NOT EXISTS rider_earnings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rider_id INTEGER NOT NULL,
        delivery_id INTEGER NOT NULL UNIQUE,
        amount REAL NOT NULL CHECK(amount >= 0),
        status TEXT NOT NULL DEFAULT 'available',
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(rider_id) REFERENCES riders(id) ON DELETE CASCADE,
        FOREIGN KEY(delivery_id) REFERENCES deliveries(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS rider_notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rider_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'info',
        delivery_id INTEGER,
        read_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(rider_id) REFERENCES riders(id) ON DELETE CASCADE,
        FOREIGN KEY(delivery_id) REFERENCES deliveries(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS rider_locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rider_id INTEGER NOT NULL,
        delivery_id INTEGER,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        accuracy REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(rider_id) REFERENCES riders(id) ON DELETE CASCADE,
        FOREIGN KEY(delivery_id) REFERENCES deliveries(id) ON DELETE SET NULL
    );
    CREATE TABLE IF NOT EXISTS rider_subscription_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        price REAL NOT NULL CHECK(price >= 0),
        duration_days INTEGER NOT NULL CHECK(duration_days > 0),
        description TEXT,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS rider_subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rider_id INTEGER NOT NULL,
        plan_id INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        starts_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME NOT NULL,
        amount_paid REAL NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(rider_id) REFERENCES riders(id) ON DELETE CASCADE,
        FOREIGN KEY(plan_id) REFERENCES rider_subscription_plans(id)
    );
    CREATE TABLE IF NOT EXISTS rider_referrals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        referrer_rider_id INTEGER NOT NULL,
        referred_rider_id INTEGER NOT NULL UNIQUE,
        reward_amount REAL NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'pending',
        rewarded_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(referrer_rider_id) REFERENCES riders(id) ON DELETE CASCADE,
        FOREIGN KEY(referred_rider_id) REFERENCES riders(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS rider_withdrawals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rider_id INTEGER NOT NULL,
        amount REAL NOT NULL CHECK(amount > 0),
        status TEXT NOT NULL DEFAULT 'pending',
        bank_name TEXT NOT NULL,
        account_name TEXT NOT NULL,
        account_number_masked TEXT NOT NULL,
        provider_reference TEXT,
        admin_note TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        processed_at DATETIME,
        FOREIGN KEY(rider_id) REFERENCES riders(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS rider_push_subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rider_id INTEGER NOT NULL,
        endpoint TEXT NOT NULL UNIQUE,
        subscription_json TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(rider_id) REFERENCES riders(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_rider_earnings_rider ON rider_earnings(rider_id);
    CREATE INDEX IF NOT EXISTS idx_rider_notifications_rider ON rider_notifications(rider_id, read_at);
    CREATE INDEX IF NOT EXISTS idx_rider_locations_rider ON rider_locations(rider_id, created_at);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_riders_referral_code ON riders(referral_code) WHERE referral_code IS NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_rider_subscriptions_rider ON rider_subscriptions(rider_id, expires_at);
    CREATE INDEX IF NOT EXISTS idx_rider_withdrawals_rider ON rider_withdrawals(rider_id, created_at);
    CREATE TRIGGER IF NOT EXISTS reward_rider_referral_after_first_delivery
    AFTER UPDATE OF successful_deliveries ON riders
    WHEN NEW.successful_deliveries = 1
    BEGIN
        UPDATE riders SET
            wallet_balance = wallet_balance + COALESCE((SELECT reward_amount FROM rider_referrals WHERE referred_rider_id=NEW.id AND status='pending'),0),
            total_earnings = total_earnings + COALESCE((SELECT reward_amount FROM rider_referrals WHERE referred_rider_id=NEW.id AND status='pending'),0)
        WHERE id=(SELECT referrer_rider_id FROM rider_referrals WHERE referred_rider_id=NEW.id AND status='pending');
        UPDATE rider_referrals SET status='rewarded',rewarded_at=CURRENT_TIMESTAMP WHERE referred_rider_id=NEW.id AND status='pending';
    END;
`);

db.prepare("INSERT OR IGNORE INTO rider_subscription_plans(name,price,duration_days,description) VALUES('Standard',0,30,'Core delivery access')").run();

db.exec(`
    CREATE TABLE IF NOT EXISTS staff_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        email TEXT UNIQUE,
        phone TEXT,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'staff',
        account_status TEXT NOT NULL DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_staff_users_role ON staff_users(role);
    CREATE INDEX IF NOT EXISTS idx_staff_users_status ON staff_users(account_status);
`);

console.log("✅ Rider and delivery tables ready");

try {

    db.prepare(`
        SELECT 1
    `).get();

    console.log(
        "✅ SQLite database health check passed"
    );

} catch (error) {

    console.error(
        "❌ SQLite database health check failed:",
        error
    );

    throw error;

}


// =====================================================
// EXPORT DATABASE
// =====================================================

export default db;
