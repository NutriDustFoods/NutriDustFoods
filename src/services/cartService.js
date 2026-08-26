let cart =
    JSON.parse(
        localStorage.getItem("nutridust-cart")
    ) || [];


// =====================================================
// SAVE CART
// =====================================================

function saveCart() {

    localStorage.setItem(
        "nutridust-cart",
        JSON.stringify(cart)
    );

}


// =====================================================
// GET CART
// =====================================================

export function getCart() {

    return cart;

}


// =====================================================
// ADD TO CART
// =====================================================

export function addToCart(product) {

    const productId =
        product._id || product.id;


    const availableStock =
        Number(
            product.quantityAvailable ?? 0
        );


    // -------------------------------------------------
    // OUT OF STOCK
    // -------------------------------------------------

    if (availableStock <= 0) {

        return {

            success: false,

            message:
                `${product.name} is currently out of stock.`

        };

    }


    const existing =
        cart.find(
            item =>
                (item._id || item.id) ==
                productId
        );


    // -------------------------------------------------
    // ALREADY IN CART
    // -------------------------------------------------

    if (existing) {

        if (
            existing.quantity >=
            availableStock
        ) {

            return {

                success: false,

                message:
                    `Only ${availableStock.toLocaleString()} unit(s) of ${product.name} are available.`

            };

        }


        existing.quantity++;

        // Keep stock information current
        existing.quantityAvailable =
            availableStock;

    }


    // -------------------------------------------------
    // NEW PRODUCT
    // -------------------------------------------------

    else {

        cart.push({

            ...product,

            _id:
                productId,

            quantity:
                1,

            quantityAvailable:
                availableStock

        });

    }


    saveCart();


    return {

        success: true,

        cart

    };

}


// =====================================================
// CART COUNT
// =====================================================

export function getCartCount() {

    return cart.reduce(

        (
            total,
            item
        ) =>
            total +
            Number(
                item.quantity || 0
            ),

        0

    );

}


// =====================================================
// INCREASE QUANTITY
// =====================================================

export function increaseQuantity(id) {

    const item =
        cart.find(
            product =>
                (product._id || product.id) ==
                id
        );


    if (!item) {

        return {

            success: false,

            message:
                "Product not found in cart."

        };

    }


    const availableStock =
        Number(
            item.quantityAvailable ?? 0
        );


    // -------------------------------------------------
    // STOCK LIMIT
    // -------------------------------------------------

    if (
        item.quantity >=
        availableStock
    ) {

        return {

            success: false,

            message:
                `Only ${availableStock.toLocaleString()} unit(s) available.`

        };

    }


    item.quantity++;


    saveCart();


    return {

        success: true,

        cart

    };

}


// =====================================================
// DECREASE QUANTITY
// =====================================================

export function decreaseQuantity(id) {

    const item =
        cart.find(
            product =>
                (product._id || product.id) ==
                id
        );


    if (!item) {

        return {

            success: false,

            message:
                "Product not found in cart."

        };

    }


    item.quantity--;


    if (
        item.quantity <= 0
    ) {

        cart =
            cart.filter(
                product =>
                    (product._id || product.id) !=
                    id
            );

    }


    saveCart();


    return {

        success: true,

        cart

    };

}


// =====================================================
// CLEAR CART
// =====================================================

export function clearCart() {

    cart = [];

    saveCart();

}

// Remove one product line regardless of its selected quantity.
export function removeFromCart(id) {
    const originalLength = cart.length;
    cart = cart.filter(product => (product._id || product.id) != id);
    saveCart();
    return {
        success: cart.length < originalLength,
        cart
    };
}
