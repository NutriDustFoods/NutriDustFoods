import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import { getSupabaseClient, isSupabaseConfigured } from "./supabaseClient.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bucket = process.env.SUPABASE_RIDER_DOCUMENT_BUCKET || "rider-documents";
const localDirectory = path.resolve(__dirname, "..", "uploads", "rider-documents");

export const uploadRiderDocument = async (file, applicantKey, kind) => {
    if (!file) return null;
    const extension = path.extname(file.originalname).toLowerCase() || ".bin";
    const objectPath = `applications/${String(applicantKey).replace(/[^a-z0-9_-]/gi, "-")}/${kind}-${randomUUID()}${extension}`;
    if (isSupabaseConfigured()) {
        const { error } = await getSupabaseClient().storage.from(bucket).upload(objectPath, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
            cacheControl: "private, max-age=0"
        });
        if (error) throw new Error(`Unable to store rider document: ${error.message}`);
        return objectPath;
    }
    await fs.mkdir(localDirectory, { recursive: true });
    const filename = objectPath.replaceAll("/", "-");
    await fs.writeFile(path.join(localDirectory, filename), file.buffer);
    return `local:${filename}`;
};

export const getRiderDocumentAccess = async storedPath => {
    if (!storedPath) return null;
    if (storedPath.startsWith("local:")) {
        const filename = storedPath.slice(6);
        const filePath = path.resolve(localDirectory, filename);
        if (!filePath.startsWith(`${localDirectory}${path.sep}`)) throw new Error("Unsafe rider document path.");
        return { filePath };
    }
    const { data, error } = await getSupabaseClient().storage.from(bucket).createSignedUrl(storedPath, 600);
    if (error) throw new Error(`Unable to open rider document: ${error.message}`);
    return { signedUrl: data.signedUrl };
};

