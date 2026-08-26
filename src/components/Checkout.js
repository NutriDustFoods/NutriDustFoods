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

<fieldset class="mb-4">
<legend class="h5 text-warning fw-bold mb-3">Choose how to receive your order</legend>
<div class="row g-3">
<div class="col-md-6"><label class="fulfillment-option"><input class="fulfillment-radio" type="radio" name="fulfillmentType" value="pickup"><span class="fulfillment-icon"><i class="bi bi-bag-check-fill"></i></span><span class="fulfillment-copy"><strong>Self Pickup</strong><small>Pick up your order when it is ready.</small><b>FREE - No delivery charge</b></span><span class="fulfillment-check"><i class="bi bi-check-circle-fill"></i></span></label></div>
<div class="col-md-6"><label class="fulfillment-option"><input class="fulfillment-radio" type="radio" name="fulfillmentType" value="delivery" checked><span class="fulfillment-icon"><i class="bi bi-truck"></i></span><span class="fulfillment-copy"><strong>Delivered to You</strong><small>We bring your order to your address.</small><b>Delivery charge applies</b></span><span class="fulfillment-check"><i class="bi bi-check-circle-fill"></i></span></label></div>
</div>
</fieldset>

<div class="mb-3" id="deliveryAddressGroup">

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

<div class="d-flex justify-content-between mb-2"><span>Items subtotal</span><strong id="checkoutSubtotal">₦0</strong></div>
<div class="d-flex justify-content-between mb-3"><span>Delivery charge</span><strong id="checkoutDeliveryFee">₦0</strong></div>


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
