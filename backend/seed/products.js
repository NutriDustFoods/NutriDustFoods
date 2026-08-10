import Product from "../models/Product.js";

const products = [
    {
        name: "Premium Beef Jerky",
        category: "Jerky",
        description: "High-protein halal beef jerky made from premium lean beef.",
        image: "beef-jerky.png",
        price: 3500,
        rating: 5,
        badge: "BEST SELLER"
    },

    {
        name: "Chicken Jerky",
        category: "Jerky",
        description: "Tender chicken jerky packed with protein.",
        image: "chicken-jerky.png",
        price: 3200,
        rating: 5,
        badge: "NEW"
    },

    {
        name: "Spicy Stick Jerky",
        category: "Stick Jerky",
        description: "Spicy meat sticks with bold African flavour.",
        image: "stick-spicy.png",
        price: 2500,
        rating: 4,
        badge: "HOT"
    },

    {
        name: "Nut Stick Jerky",
        category: "Healthy Snack",
        description: "Protein-rich meat sticks coated with nuts and seeds.",
        image: "stick-nuts.png",
        price: 2700,
        rating: 5,
        badge: "POPULAR"
    },

    {
        name: "Fruit Powder",
        category: "Nutrition",
        description: "100% natural fruit powders for healthy living.",
        image: "fruit-powder.png",
        price: 2800,
        rating: 5,
        badge: "100% NATURAL"
    },

    {
        name: "Baby Food",
        category: "Nutrition",
        description: "Nutritious complementary food for healthy growth.",
        image: "baby-food.png",
        price: 3000,
        rating: 5,
        badge: "PREMIUM"
    }
];

const importData = () => {
    try {
        Product.deleteAll();

        for (const product of products) {
            Product.create(product);
        }

        console.log("✅ Products imported into SQLite");

        process.exit(0);

    } catch (error) {

        console.error("❌ Error importing products:", error);

        process.exit(1);
    }
};

importData();