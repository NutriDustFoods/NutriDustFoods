import axios from "axios";

const API = axios.create({ baseURL: __API_URL__ });
const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("nutridust-admin-token")}` } });

const permissionLabels = {
    "orders.view": "View and receive orders",
    "orders.update": "Update order status",
    "products.view": "View products",
    "products.manage": "Create and edit products",
    "inventory.view": "View stock and reports",
    "inventory.manage": "Add or adjust stock (storekeeper)",
    "riders.view": "View riders and deliveries",
    "riders.manage": "Create and manage riders",
    "deliveries.assign": "Assign deliveries to riders",
    "withdrawals.manage": "Process rider withdrawals",
    "operations.view": "View operations overview",
    "operations.run": "Run operations automation",
    "staff.manage": "Create staff and assign access"
};

const escapeHtml = value => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;");

const permissionChecks = (selected = [], name = "permission") => Object.entries(permissionLabels)
    .map(([value, label]) => `<label class="form-check col-md-6 mb-2"><input class="form-check-input" type="checkbox" name="${name}" value="${value}" ${selected.includes(value) ? "checked" : ""}><span class="form-check-label">${label}</span></label>`)
    .join("");

export function AdminStaff() {
    return `<section class="container-fluid px-lg-5 pb-5"><div class="card shadow-sm"><div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3"><div><h2 class="h4 mb-1">Staff access</h2><p class="text-secondary mb-0">Create a user and select the exact tasks they may perform.</p></div><button class="btn btn-dark" id="openStaffForm">Create User</button></div>
        <div id="staffMessage"></div>
        <form id="staffForm" class="d-none mb-4 border rounded p-3">
            <div class="row g-2 mb-3"><div class="col-md-3"><input name="fullName" class="form-control" placeholder="Full name" required></div><div class="col-md-2"><input name="username" class="form-control" placeholder="Username" required></div><div class="col-md-2"><input name="password" type="password" minlength="8" class="form-control" placeholder="Temporary password" required></div><div class="col-md-2"><select name="role" class="form-select"><option value="staff">Staff</option><option value="manager">Manager</option><option value="accountant">Accountant</option><option value="cashier">Cashier</option><option value="support">Support</option></select></div><div class="col-md-3"><input name="phone" class="form-control" placeholder="Phone (optional)"></div></div>
            <h3 class="h6">Allowed tasks</h3><div class="row">${permissionChecks()}</div><button class="btn btn-success mt-2">Create account</button>
        </form>
        <div class="table-responsive"><table class="table align-middle"><thead><tr><th>Name</th><th>Username</th><th>Job title</th><th>Allowed tasks</th><th>Status</th><th></th></tr></thead><tbody id="staffRows"><tr><td colspan="6">Loading...</td></tr></tbody></table></div>
    </div></div></section>`;
}

export async function setupAdminStaff() {
    const form = document.getElementById("staffForm");
    const message = document.getElementById("staffMessage");
    document.getElementById("openStaffForm")?.addEventListener("click", () => form.classList.toggle("d-none"));
    const showMessage = (text, type = "success") => { message.innerHTML = `<div class="alert alert-${type}">${escapeHtml(text)}</div>`; };

    const load = async () => {
        const { data } = await API.get("/admin/staff", auth());
        const rows = document.getElementById("staffRows");
        rows.innerHTML = data.staff.map(staff => {
            const labels = staff.permissions.map(item => permissionLabels[item] || item);
            return `<tr><td>${escapeHtml(staff.fullName)}</td><td>${escapeHtml(staff.username)}</td><td><span class="badge text-bg-secondary">${escapeHtml(staff.role)}</span></td>
                <td><small>${labels.map(escapeHtml).join("<br>") || "No tasks assigned"}</small><details class="mt-2"><summary class="btn btn-sm btn-outline-dark">Edit access</summary><form class="permission-editor border rounded p-2 mt-2" data-staff-id="${staff.id}"><div class="row">${permissionChecks(staff.permissions, "editPermission")}</div><button class="btn btn-sm btn-success mt-2">Save access</button></form></details></td>
                <td>${escapeHtml(staff.accountStatus)}</td><td><button class="btn btn-sm btn-outline-secondary staff-status" data-staff-id="${staff.id}" data-next-status="${staff.accountStatus === "active" ? "inactive" : "active"}">${staff.accountStatus === "active" ? "Disable" : "Enable"}</button></td></tr>`;
        }).join("") || '<tr><td colspan="6">No staff accounts yet.</td></tr>';

        rows.querySelectorAll(".permission-editor").forEach(editor => editor.addEventListener("submit", async event => {
            event.preventDefault();
            const permissions = [...editor.querySelectorAll('input[name="editPermission"]:checked')].map(input => input.value);
            try { await API.patch(`/admin/staff/${editor.dataset.staffId}/permissions`, { permissions }, auth()); showMessage("Staff access updated."); await load(); }
            catch (error) { showMessage(error.response?.data?.message || "Unable to update staff access.", "danger"); }
        }));
        rows.querySelectorAll(".staff-status").forEach(button => button.addEventListener("click", async () => {
            try { await API.patch(`/admin/staff/${button.dataset.staffId}/status`, { accountStatus: button.dataset.nextStatus }, auth()); await load(); }
            catch (error) { showMessage(error.response?.data?.message || "Unable to update account status.", "danger"); }
        }));
    };

    form?.addEventListener("submit", async event => {
        event.preventDefault();
        const payload = Object.fromEntries(new FormData(form));
        payload.permissions = [...form.querySelectorAll('input[name="permission"]:checked')].map(input => input.value);
        try { await API.post("/admin/staff", payload, auth()); form.reset(); form.classList.add("d-none"); showMessage("Staff account created."); await load(); }
        catch (error) { showMessage(error.response?.data?.message || "Unable to create account.", "danger"); }
    });

    window.addEventListener("nutridust:admin-refresh", event => { if (event.detail?.view === "staff") load(); });
    await load();
}
