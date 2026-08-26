import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { getSupabaseClient, isSupabaseConfigured } from "./supabaseClient.js";

const databaseBucket = process.env.SUPABASE_DATABASE_BUCKET || "backend-state";
const databaseObject = process.env.SUPABASE_DATABASE_OBJECT || "nutridust.db";

let backupTimer;
let backupPromise;
let backupRequested = false;

const databasePath = () =>
    path.resolve(
        process.env.SQLITE_PATH ||
        fileURLToPath(new URL("../nutridust.db", import.meta.url))
    );

const isMissingObjectError = error =>
    error?.statusCode === "404" ||
    error?.status === 404 ||
    String(error?.message || "").toLowerCase().includes("not found");

export const restoreDatabase = async () => {
    if (!isSupabaseConfigured()) {
        return false;
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase.storage
        .from(databaseBucket)
        .download(databaseObject);

    if (error) {
        if (isMissingObjectError(error)) {
            console.log("ℹ️ No remote database snapshot exists yet; starting fresh.");
            return false;
        }

        throw new Error(`Unable to restore database snapshot: ${error.message}`);
    }

    const target = databasePath();
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, Buffer.from(await data.arrayBuffer()));
    console.log("✅ SQLite database restored from Supabase Storage");
    return true;
};

const performBackup = async () => {
    const [{ default: db }, supabase] = await Promise.all([
        import("../config/sqlite.js"),
        Promise.resolve(getSupabaseClient())
    ]);

    const snapshotPath = `${databasePath()}.snapshot-${process.pid}`;

    try {
        await db.backup(snapshotPath);
        const snapshot = await fs.readFile(snapshotPath);
        const { error } = await supabase.storage
            .from(databaseBucket)
            .upload(databaseObject, snapshot, {
                contentType: "application/x-sqlite3",
                upsert: true,
                cacheControl: "0"
            });

        if (error) {
            throw new Error(error.message);
        }

        console.log("☁️ SQLite database snapshot saved to Supabase Storage");
    } finally {
        await fs.rm(snapshotPath, { force: true });
    }
};

export const flushDatabaseBackup = async () => {
    if (!isSupabaseConfigured()) {
        return;
    }

    backupRequested = true;

    if (backupPromise) {
        await backupPromise;
        return;
    }

    backupPromise = (async () => {
        while (backupRequested) {
            backupRequested = false;
            try {
                await performBackup();
            } catch (error) {
                console.error("⚠️ Unable to save database snapshot:", error.message);
                backupRequested = true;
                break;
            }
        }
    })();

    try {
        await backupPromise;
    } finally {
        backupPromise = null;
    }
};

export const scheduleDatabaseBackup = () => {
    if (!isSupabaseConfigured()) {
        return;
    }

    backupRequested = true;
    clearTimeout(backupTimer);
    backupTimer = setTimeout(() => {
        flushDatabaseBackup().catch(error => {
            console.error("⚠️ Database backup scheduling error:", error.message);
        });
    }, 750);
};
