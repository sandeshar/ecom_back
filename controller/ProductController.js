import fs from "fs";
import path from "path";
import Product from "../model/Product.model.js";

const UPLOADS_DIR = path.resolve("uploads");

const parseListField = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) {
        return value
            .flatMap((entry) => parseListField(entry))
            .filter(Boolean);
    }

    if (typeof value === "string") {
        if (value.trim().startsWith("[")) {
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
            } catch (error) {
                console.warn("Failed to JSON parse list field", value, error.message);
            }
        }

        return value
            .split(/\r?\n|,/)
            .map((entry) => entry.trim())
            .filter(Boolean);
    }

    return [];
};

const parseNumber = (value) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value === "number") return value;
    const clean = String(value).replace(/[^0-9.\-]/g, "");
    const parsed = Number.parseFloat(clean);
    return Number.isNaN(parsed) ? undefined : parsed;
};

const removeFileIfExists = (filename) => {
    if (!filename) return;
    const filePath = path.join(UPLOADS_DIR, filename);
    fs.promises
        .stat(filePath)
        .then(() => fs.promises.unlink(filePath))
        .catch(() => {
            /* no-op if missing */
        });
};

const buildProductPayload = (body) => {
    const payload = {
        name: body.name,
        slug: body.slug,
        description: body.description,
        highlights: parseListField(body.highlights),
        price: parseNumber(body.price),
        categories: parseListField(body.categories),
        licenseTiers: parseListField(body.licenseTiers),
        tags: parseListField(body.tags),
        badge: body.badge || undefined,
        sku: body.sku || undefined,
        inventory: parseNumber(body.inventory) ?? undefined,
        digitalAssetUrl: body.digitalAssetUrl || undefined,
        published: body.published === undefined ? undefined : body.published === "true" || body.published === true,
    };

    if (payload.price === undefined) {
        throw new Error("Price is required and must be numeric");
    }

    if (!payload.categories.length && body.categories) {
        payload.categories = [body.categories].flat().filter(Boolean);
    }

    if (payload.inventory !== undefined && payload.inventory < 0) {
        payload.inventory = 0;
    }

    Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined) {
            delete payload[key];
        }
    });

    return payload;
};

export const addProduct = async (req, res) => {
    try {
        const payload = buildProductPayload(req.body);

        const heroImage = req.files?.heroImage?.[0]?.filename || null;
        const galleryImages = req.files?.galleryImages?.map((file) => file.filename) || [];

        const product = await Product.create({
            ...payload,
            heroImage,
            galleryImages,
        });

        return res.status(201).json(product);
    } catch (error) {
        console.error("Add product failed", error);
        return res.status(400).json({ message: error.message });
    }
};

export const getProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            search,
            category,
            tag,
            published,
            minPrice,
            maxPrice,
        } = req.query;

        const parsedPage = Number.parseInt(page, 10) || 1;
        const parsedLimit = Number.parseInt(limit, 10) || 20;

        const filter = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { tags: { $regex: search, $options: "i" } },
            ];
        }

        if (category) {
            filter.categories = { $in: [category] };
        }

        if (tag) {
            filter.tags = { $in: [tag] };
        }

        if (published !== undefined) {
            filter.published = published === "true" || published === true;
        }

        const priceFilter = {};
        const min = parseNumber(minPrice);
        const max = parseNumber(maxPrice);

        if (min !== undefined) {
            priceFilter.$gte = min;
        }

        if (max !== undefined) {
            priceFilter.$lte = max;
        }

        if (Object.keys(priceFilter).length > 0) {
            filter.price = priceFilter;
        }

        const skip = (parsedPage - 1) * parsedLimit;

        const [items, total] = await Promise.all([
            Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parsedLimit),
            Product.countDocuments(filter),
        ]);

        return res.json({
            data: items,
            pagination: {
                total,
                page: parsedPage,
                limit: parsedLimit,
                totalPages: Math.ceil(total / parsedLimit) || 1,
            },
        });
    } catch (error) {
        console.error("Get products failed", error);
        return res.status(500).json({ message: "Unable to fetch products" });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.json(product);
    } catch (error) {
        console.error("Get product by id failed", error);
        return res.status(400).json({ message: "Invalid product id" });
    }
};

export const getProductBySlug = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.json(product);
    } catch (error) {
        console.error("Get product by slug failed", error);
        return res.status(500).json({ message: "Unable to fetch product" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const payload = buildProductPayload(req.body);

        const heroImage = req.files?.heroImage?.[0]?.filename;
        if (heroImage) {
            removeFileIfExists(product.heroImage);
            product.heroImage = heroImage;
        }

        const galleryUploads = req.files?.galleryImages?.map((file) => file.filename) || [];
        const existingGallery = parseListField(req.body.existingGalleryImages);

        if (galleryUploads.length > 0) {
            const removedImages = product.galleryImages.filter((filename) => !existingGallery.includes(filename));
            removedImages.forEach(removeFileIfExists);
            product.galleryImages = [...existingGallery, ...galleryUploads];
        } else if (existingGallery.length > 0) {
            const removedImages = product.galleryImages.filter((filename) => !existingGallery.includes(filename));
            removedImages.forEach(removeFileIfExists);
            product.galleryImages = existingGallery;
        }

        Object.assign(product, payload);

        await product.save();

        return res.json(product);
    } catch (error) {
        console.error("Update product failed", error);
        return res.status(400).json({ message: error.message || "Unable to update product" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        removeFileIfExists(product.heroImage);
        product.galleryImages.forEach(removeFileIfExists);

        await product.deleteOne();

        return res.json({ message: "Product deleted" });
    } catch (error) {
        console.error("Delete product failed", error);
        return res.status(400).json({ message: "Unable to delete product" });
    }
};

export const togglePublish = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.published = !product.published;
        await product.save();

        return res.json(product);
    } catch (error) {
        console.error("Toggle publish failed", error);
        return res.status(400).json({ message: "Unable to toggle publish state" });
    }
};