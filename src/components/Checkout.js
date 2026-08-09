export function Checkout() {

return `

<div
class="modal fade"
id="checkoutModal"
tabindex="-1">

<div class="modal-dialog modal-lg">

<div class="modal-content bg-dark text-white">

<div class="modal-header border-warning">

<h3 class="text-warning">

Checkout

</h3>

<button
type="button"
class="btn-close btn-close-white"
data-bs-dismiss="modal">
</button>

</div>

<div class="modal-body">

<form id="checkoutForm">

<div class="mb-3">

<label class="form-label">

Full Name

</label>

<input
type="text"
class="form-control"
id="customerName"
required>

</div>

<div class="mb-3">

<label class="form-label">

Phone Number

</label>

<input
type="tel"
class="form-control"
id="customerPhone"
required>

</div>

<div class="mb-3">

<label class="form-label">

Email Address

</label>

<input
type="email"
class="form-control"
id="customerEmail"
required>

</div>

<div class="mb-3">

<label class="form-label">

Delivery Address

</label>

<textarea
class="form-control"
rows="3"
id="customerAddress"
required></textarea>

</div>

<hr>

<h4 class="text-warning">

Order Total

</h4>

<h2 id="checkoutTotal">

₦0

</h2>

<button
type="submit"
class="btn btn-warning w-100 mt-4">

Continue to Payment

</button>

</form>

</div>

</div>

</div>

</div>

`;

}