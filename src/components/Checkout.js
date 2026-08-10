export function Checkout() {

    return `

<div
class="modal fade"
id="checkoutModal"
tabindex="-1"
aria-labelledby="checkoutModalLabel"
aria-hidden="true">

<div class="modal-dialog modal-lg">

<div class="modal-content bg-dark text-white">

<div class="modal-header border-warning">

<h3
class="text-warning"
id="checkoutModalLabel">

Checkout

</h3>

<button
type="button"
class="btn-close btn-close-white"
data-bs-dismiss="modal"
aria-label="Close">
</button>

</div>

<div class="modal-body">

<form id="checkoutForm">

<div class="mb-3">

<label
for="customerName"
class="form-label">

Full Name

</label>

<input
type="text"
class="form-control"
id="customerName"
name="customerName"
required>

</div>


<div class="mb-3">

<label
for="customerPhone"
class="form-label">

Phone Number

</label>

<input
type="tel"
class="form-control"
id="customerPhone"
name="customerPhone"
required>

</div>


<div class="mb-3">

<label
for="customerEmail"
class="form-label">

Email Address

</label>

<input
type="email"
class="form-control"
id="customerEmail"
name="customerEmail"
required>

</div>


<div class="mb-3">

<label
for="customerAddress"
class="form-label">

Delivery Address

</label>

<textarea
class="form-control"
rows="3"
id="customerAddress"
name="customerAddress"
required></textarea>

</div>


<hr>


<h4 class="text-warning">

Order Total

</h4>


<h2
id="checkoutTotal"
class="fw-bold">

₦0

</h2>


<button
type="submit"
id="continuePaymentButton"
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