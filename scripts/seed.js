import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../helper/db.js";
import Product from "../model/Product.model.js";
import Order from "../model/Order.model.js";

const productSeedData = [
    {
        name: "Aurora Abstract Kit",
        slug: "aurora-abstract-kit",
        description: "50 gradient-rich backgrounds perfect for landing pages and hero sections.",
        heroImage:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAIKtic_KdOjj1KNmAoFtyiH6p2IdLhKUloo5uJIL-gYZhpWrK4F_RkmDvGgc0QJ85oXEAzboLdVso1UdplDyBHwkfey-Gx-lM9mEJYxYs72ZUNFZtA7keDm8PS_hnAY67Zr2NNFtZPgDKnYwzXNijTj45YhvUQ0Q8zjCb-UIa49Z5am1Wc4QYl-6djeTKJ9LjhsOZdb02gFB4gIHqn8JUzVhoKu3mcv4CoGQOzgZqs3hzNMqS-",
        galleryImages: [
            "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
            "https://images.unsplash.com/photo-1545239351-1141bd82e8a6",
        ],
        highlights: [
            "50 high-resolution gradient backgrounds",
            "Includes PNG and SVG exports",
            "Optimised for modern landing pages",
        ],
        price: 38,
        categories: ["Illustrations", "Backgrounds"],
        licenseTiers: ["Personal", "Commercial"],
        tags: ["gradient", "illustrations", "ui"],
        badge: "Best Seller",
        sku: "SKU-AURORA-001",
        inventory: 120,
        digitalAssetUrl: "https://cdn.designhub.dev/assets/aurora-abstract-kit.zip",
        published: true,
    },
    {
        name: "Neon Future UI Pack",
        slug: "neon-future-ui-pack",
        description: "Fully editable UI kit inspired by futuristic dashboards and analytics.",
        heroImage:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCUiguJQz-YC1F0n3lGuUSJNlwSGv7lO5NaCnIU9J0PqG6i_97B2qrFJL8RYq6HgtzAm5MWKGAfIsThMiEaKHzO6nK77bKddS7nFNGq5RJ5kChzewrIgX6ylZU-_Vw-SvSe5dh3VcZbZk9h80J3hgFe41HsGfe06WNjbt2gGjOx3sZWHeWwWmQDrtPnWQ8s0Vz5blb3g6YCJxGY-7Y-Zg",
        galleryImages: [
            "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
        ],
        highlights: [
            "80+ desktop and mobile screens",
            "Auto-layout ready",
            "Figma, Sketch, and XD files included",
        ],
        price: 45,
        categories: ["UI Kits", "Dashboards"],
        licenseTiers: ["Personal", "Commercial", "Extended"],
        tags: ["ui", "dashboard", "dark"],
        inventory: 80,
        sku: "SKU-NEON-002",
        published: true,
        digitalAssetUrl: "https://cdn.designhub.dev/assets/neon-future-ui-pack.zip",
    },
    {
        name: "Earthy Pattern Collection",
        slug: "earthy-pattern-collection",
        description: "Hand-drawn seamless patterns inspired by natural textures and tones.",
        heroImage:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAhtSun1SgoLtVHzVrFmR8rnS4icMBQNteGYoYgMvbFzYUPPzr7GwkV3CJSIgJa66MzcItet25mp4qxqoPIf3Vsmv0Pf9-ln70X0jL0hdw4fJQ4aVoEoIxf1nFL4xtO3X-tnAVDVt3kWMyw3_DJ2FnftlIn9Ug4d7fYMUdQOJxo6g6qkIyI92KFXbMS4IYudwwF2Ik6VQeVZvbxY13a",
        galleryImages: [
            "https://images.unsplash.com/photo-1545239350-ef243010a5c5",
            "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
        ],
        highlights: [
            "30 seamless vector patterns",
            "Editable colour palettes",
            "Print-ready exports",
        ],
        price: 29,
        categories: ["Patterns", "Illustrations"],
        licenseTiers: ["Personal", "Commercial"],
        tags: ["pattern", "organic", "textures"],
        inventory: 150,
        sku: "SKU-EARTH-003",
        published: true,
        digitalAssetUrl: "https://cdn.designhub.dev/assets/earthy-pattern-collection.zip",
    },
    {
        name: "Minimal Branding Starter",
        slug: "minimal-branding-starter",
        description: "Logo templates, typography pairings, and colour palettes for bold brands.",
        heroImage:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDPfWcF_IEFjSxjiwg8P9Wol3MAslcsmuQC32tM8BXlJWf6xwI8pQg7nA-9dcbP_GrZIJkN2vdr-9CYWyWTf9gPSzbIKTBt8mEohK6AJc2QbAyelGvvyl-HTKUkDfI9bdY7u5N3KRVvwa74yKTfgP40oWcgUyWnU1xeyf8gTBEEA8qttsmqxMyO92-lbfCorJhf-qem2kNCI-frkHWUs",
        galleryImages: [
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        ],
        highlights: [
            "24 customizable logo templates",
            "Six complete brand style guides",
            "Includes social media kit",
        ],
        price: 52,
        categories: ["Branding", "Templates"],
        licenseTiers: ["Commercial", "Extended"],
        tags: ["branding", "templates", "identity"],
        badge: "Featured",
        inventory: 60,
        sku: "SKU-MINIMAL-004",
        published: true,
        digitalAssetUrl: "https://cdn.designhub.dev/assets/minimal-branding-starter.zip",
    },
    {
        name: "Motion Elements Toolkit",
        slug: "motion-elements-toolkit",
        description: "Animated SVGs and Lottie files to elevate product interactions.",
        heroImage:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCWEYwD9f8lYLuOowxkQWXpknA0f67S5AlFBHN-_q4YZtdOwRbGXGz1rH3U5cJ9urh3bGb3oMcdWF9Y3Vgy7-32fNq4V0l4lDEW_fJb2FxbTBewFVC9n3dwmfsyijqsYvH1JM0Kxa7oA9ZZf0jzU8ZxVc6S_4RzVCyCgfo",
        galleryImages: [
            "https://images.unsplash.com/photo-1553877522-43269d4ea984",
            "https://images.unsplash.com/photo-1523475472560-d2df97ec485c",
        ],
        highlights: [
            "120 animated SVG icons",
            "40 ready-to-use Lottie files",
            "Includes interaction guidelines",
        ],
        price: 34,
        categories: ["Animation", "Motion"],
        licenseTiers: ["Commercial", "Extended"],
        tags: ["animation", "motion", "svg"],
        inventory: 95,
        sku: "SKU-MOTION-005",
        published: true,
        digitalAssetUrl: "https://cdn.designhub.dev/assets/motion-elements-toolkit.zip",
    },
    {
        name: "Serif Type Suite",
        slug: "serif-type-suite",
        description: "A curated serif type system with alternate glyphs and ligatures.",
        heroImage:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAk2uGtULKD82Ke14KY7Kqo2Ue3qLEAzoFkM4sLgKu3_1q-0wGf1EVb6LT9lYVI5wRrVf8iT8YGLTMiBSVmK-l5oJXl8Ag1UC9f7Kp5WQeQYJKhY9zAhIrxETvCCgkUYzXig3KD7eQwHoPExrhNGty-tCgqO-Y4IrONmv0",
        galleryImages: [
            "https://images.unsplash.com/photo-1472289065668-ce650ac443d2",
            "https://images.unsplash.com/photo-1522163182402-834f871fd851",
        ],
        highlights: [
            "7 font weights with italics",
            "Extended Latin character set",
            "OpenType ligatures and stylistic alternates",
        ],
        price: 24,
        categories: ["Typography", "Fonts"],
        licenseTiers: ["Personal", "Commercial"],
        tags: ["fonts", "typography", "serif"],
        inventory: 200,
        sku: "SKU-SERIF-006",
        published: true,
        digitalAssetUrl: "https://cdn.designhub.dev/assets/serif-type-suite.zip",
    },
];

const calculateTotals = (items, taxRate = 0.07) => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = Math.round(subtotal * taxRate * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;
    return { subtotal, tax, total };
};

const buildOrderItem = (product, quantity) => {
    if (!product) {
        throw new Error("Attempted to build order item with missing product reference");
    }

    const qty = Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
    const subtotal = product.price * qty;
    return {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
        subtotal,
        heroImage: product.heroImage,
    };
};

const buildOrders = (products) => {
    const aurora = products.find((product) => product.slug === "aurora-abstract-kit");
    const neon = products.find((product) => product.slug === "neon-future-ui-pack");
    const earthy = products.find((product) => product.slug === "earthy-pattern-collection");
    const branding = products.find((product) => product.slug === "minimal-branding-starter");
    const motion = products.find((product) => product.slug === "motion-elements-toolkit");
    const serif = products.find((product) => product.slug === "serif-type-suite");

    const missing = [aurora, neon, earthy, branding, motion, serif].some((product) => !product);
    if (missing) {
        throw new Error("One or more referenced products were not inserted correctly during seeding");
    }

    const orders = [
        {
            orderNumber: "ORD-1001",
            status: "Processing",
            paymentStatus: "Paid",
            customer: {
                name: "Samuel Lee",
                email: "sam@collectivestudio.com",
                phone: "+1-415-555-0147",
            },
            billingAddress: {
                line1: "548 Market Street",
                city: "San Francisco",
                state: "CA",
                postalCode: "94104",
                country: "USA",
            },
            items: [buildOrderItem(aurora, 2), buildOrderItem(neon, 1)],
            notes: "Expedite delivery instructions shared via email",
            metadata: { source: "Seed script", channel: "Direct" },
        },
        {
            orderNumber: "ORD-1002",
            status: "Fulfilled",
            paymentStatus: "Paid",
            customer: {
                name: "Priya Desai",
                email: "priya@lumina.design",
                phone: "+44-20-7946-0958",
            },
            billingAddress: {
                line1: "221B Baker Street",
                city: "London",
                state: "",
                postalCode: "NW1 6XE",
                country: "United Kingdom",
            },
            items: [buildOrderItem(branding, 1), buildOrderItem(motion, 3)],
            notes: "Gift order - include thank you note",
            metadata: { source: "Seed script", channel: "Marketplace" },
        },
        {
            orderNumber: "ORD-1003",
            status: "Awaiting pickup",
            paymentStatus: "Pending",
            customer: {
                name: "Jordan Rivera",
                email: "jordan@email.com",
                phone: "+1-312-555-0199",
            },
            billingAddress: {
                line1: "90 State Street",
                city: "Chicago",
                state: "IL",
                postalCode: "60603",
                country: "USA",
            },
            items: [buildOrderItem(earthy, 4)],
            metadata: { source: "Seed script", channel: "Affiliate" },
        },
        {
            orderNumber: "ORD-1004",
            status: "Refund requested",
            paymentStatus: "Refunded",
            customer: {
                name: "Sasha Kim",
                email: "sasha@atelier.studio",
                phone: "+82-2-312-4578",
            },
            billingAddress: {
                line1: "17 Teheran-ro",
                city: "Seoul",
                state: "",
                postalCode: "06236",
                country: "South Korea",
            },
            items: [buildOrderItem(serif, 1), buildOrderItem(neon, 1)],
            notes: "Customer requested refund due to duplicate purchase",
            metadata: { source: "Seed script", channel: "Email" },
        },
    ];

    return orders.map((order) => {
        const { subtotal, tax, total } = calculateTotals(order.items);
        return {
            ...order,
            subtotal,
            tax,
            total,
        };
    });
};

async function seedDatabase() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not set. Please configure the database connection string.");
        }

        await connectDB();

        console.log("🧹 Clearing existing products and orders...");
        await Promise.all([Product.deleteMany({}), Order.deleteMany({})]);

        console.log("🌱 Seeding products...");
        const insertedProducts = await Product.insertMany(productSeedData);
        console.log(`✅ Inserted ${insertedProducts.length} products.`);

        console.log("🌱 Seeding orders...");
        const orderSeedData = buildOrders(insertedProducts);
        await Order.insertMany(orderSeedData);
        console.log(`✅ Inserted ${orderSeedData.length} orders.`);

        console.log("✨ Database seeding complete.");
    } catch (error) {
        console.error("❌ Seeding failed:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
        console.log("🔌 MongoDB connection closed.");
    }
}

seedDatabase();
