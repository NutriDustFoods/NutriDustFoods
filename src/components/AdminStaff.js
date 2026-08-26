import axios from "axios";

const API = axios.create({ baseURL: __API_URL__ });
const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("nutridust-admin-token")}` } });

export function AdminStaff() {
    return `<section class="container-fluid px-lg-5 pb-5"><div class="card shadow-sm"><div class="card-body"><div class="d-flex justify-content-between align-items-center mb-3"><h2 class="h4 mb-0">Staff &amp; Riders</h2><button class="btn btn-dark" id="openStaffForm">Create Account</button></div><div id="staffMessage"></div><form id="staffForm" class="row g-2 d-none mb-4"><div class="col-md-3"><input name="fullName" class="form-control" placeholder="Full name" required></div><div class="col-md-2"><input name="username" class="form-control" placeholder="Username (or rider phone)" required></div><div class="col-md-2"><input name="password" type="password" class="form-control" placeholder="Password" required></div><div class="col-md-2"><select name="role" class="form-select"><option value="rider">Rider</option><option value="staff">Staff</option><option value="accountant">Accountant</option><option value="cashier">Cashier</option><option value="support">Support</option><option value="manager">Manager</option></select></div><div class="col-md-2"><input name="phone" class="form-control" placeholder="Phone"></div><div class="col-md-1"><button class="btn btn-success w-100">Save</button></div></form><div class="table-responsive"><table class="table align-middle"><thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Status</th><th></th></tr></thead><tbody id="staffRows"><tr><td colspan="5">Loading...</td></tr></tbody></table></div></div></div></section>`;
}

export async function setupAdminStaff() {
    const form = document.getElementById("staffForm");
    document.getElementById("openStaffForm")?.addEventListener("click", () => form.classList.toggle("d-none"));
    const load = async () => { const { data } = await API.get("/admin/staff", auth()); document.getElementById("staffRows").innerHTML = data.staff.map(s => `<tr><td>${s.fullName}</td><td>${s.username}</td><td><span class="badge text-bg-secondary">${s.role}</span></td><td>${s.accountStatus}</td></tr>`).join("") || '<tr><td colspan="5">No staff accounts yet.</td></tr>'; };
    form?.addEventListener("submit", async event => { event.preventDefault(); try { await API.post("/admin/staff", Object.fromEntries(new FormData(form)), auth()); form.reset(); form.classList.add("d-none"); await load(); } catch (error) { document.getElementById("staffMessage").innerHTML = `<div class="alert alert-danger">${error.response?.data?.message || "Unable to create account."}</div>`; } });
    window.addEventListener("nutridust:admin-refresh", event => { if (event.detail?.view === "staff") load(); });
    await load();
}
