import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import { getSupabaseClient, isSupabaseConfigured } from "./supabaseClient.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageBucket = process.env.SUPABASE_PRODUCT_BUCKET || "product-images";

export const usesSupabaseProductStorage = () => isSupabaseConfigured();

export const uploadProductImage = async file => {
    if (!file) {
        return "";
    }

    if (!usesSupabaseProductStorage()) {
        return `/uploads/products/${file.filename}`;
    }

    const extension = path.extname(file.originalname).toLowerCase();
    const objectPath = `products/${Date.now()}-${randomUUID()}${extension}`;
    const supabase = getSupabaseClient();
    const { error } = await supabase.storage
        .from(imageBucket)
        .upload(objectPath, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
            cacheControl: "31536000"
        });

    if (error) {
        throw new Error(`Unable to upload product image: ${error.message}`);
    }

    const { data } = supabase.storage.from(imageBucket).getPublicUrl(objectPath);
    return data.publicUrl;
};

const supabaseObjectPath = imageUrl => {
    const marker = `/storage/v1/object/public/${imageBucket}/`;
    const index = String(imageUrl || "").indexOf(marker);
    return index === -1
        ? null
        : decodeURIComponent(String(imageUrl).slice(index + marker.length));
};

export const deleteProductImage = async imageUrl => {
    if (!imageUrl) {
        return;
    }

    const objectPath = supabaseObjectPath(imageUrl);

    if (objectPath && usesSupabaseProductStorage()) {
        const { error } = await getSupabaseClient().storage
            .from(imageBucket)
            .remove([objectPath]);

        if (error) {
            throw new Error(`Unable to delete product image: ${error.message}`);
        }

        return;
    }

    if (!imageUrl.startsWith("/uploads/products/")) {
        return;
    }

    const relativePath = imageUrl.replace(/^\/+/, "");
    const filePath = path.resolve(__dirname, "..", relativePath);
    const uploadsDirectory = path.resolve(__dirname, "..", "uploads", "products");

    if (!filePath.startsWith(`${uploadsDirectory}${path.sep}`)) {
        throw new Error("Blocked unsafe product image deletion path.");
    }

    await fs.rm(filePath, { force: true });
};
