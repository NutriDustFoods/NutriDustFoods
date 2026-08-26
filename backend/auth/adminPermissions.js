export const STAFF_PERMISSIONS = Object.freeze([
    "orders.view",
    "orders.update",
    "products.view",
    "products.manage",
    "inventory.view",
    "inventory.manage",
    "riders.view",
    "riders.manage",
    "deliveries.assign",
    "withdrawals.manage",
    "operations.view",
    "operations.run",
    "staff.manage"
]);

const allowed = new Set(STAFF_PERMISSIONS);

export const parsePermissions = value => {
    try {
        const parsed = Array.isArray(value) ? value : JSON.parse(value || "[]");
        const permissions = new Set(parsed.map(item => String(item).trim()).filter(item => allowed.has(item)));
        if (permissions.has("orders.update")) permissions.add("orders.view");
        if (permissions.has("products.manage")) permissions.add("products.view");
        if (permissions.has("inventory.manage")) {
            permissions.add("inventory.view");
            permissions.add("products.view");
        }
        if (permissions.has("products.view") || permissions.has("inventory.view")) {
            permissions.add("products.view");
            permissions.add("inventory.view");
        }
        if (permissions.has("riders.manage") || permissions.has("deliveries.assign")) permissions.add("riders.view");
        if (permissions.has("operations.run")) permissions.add("operations.view");
        return [...permissions];
    } catch {
        return [];
    }
};

export const hasPermission = (actor, permission) =>
    actor?.role === "admin" || actor?.permissions?.includes("*") || actor?.permissions?.includes(permission);
