const API_URL = `${__API_URL__}/products`;

export async function getProducts() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const products = await response.json();

        console.log("✅ Products loaded from SQLite:", products);

        return products;

    } catch (error) {
        console.error("❌ Failed to load products:", error);

        return [];
    }
}
