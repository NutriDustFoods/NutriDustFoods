export function Navbar() {

return `

<nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow">

<div class="container">

<a class="navbar-brand fw-bold text-warning fs-3" href="#">

<i class="bi bi-flower1 me-2"></i>

NutriDust Foods

</a>

<button class="navbar-toggler"

type="button"

data-bs-toggle="collapse"

data-bs-target="#navbar">

<span class="navbar-toggler-icon"></span>

</button>

<div class="collapse navbar-collapse"

id="navbar">

<ul class="navbar-nav ms-auto">

<li class="nav-item">

<a class="nav-link active" href="#">Home</a>

</li>

<li class="nav-item">

<a class="nav-link" href="#">Products</a>

</li>

<li class="nav-item">

<a class="nav-link" href="#">Nutrition</a>

</li>

<li class="nav-item">

<a class="nav-link" href="#">Recipes</a>

</li>

<li class="nav-item">

<a class="nav-link" href="#">Contact</a>

</li>

</ul>

</div>

</div>

</nav>

`;

}