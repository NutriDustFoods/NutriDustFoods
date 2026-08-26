import dotenv from "dotenv";

dotenv.config();

if (process.env.RENDER && !process.env.SQLITE_PATH) {
    process.env.SQLITE_PATH = "/tmp/nutridust.db";
}

const {
    restoreDatabase,
    scheduleDatabaseBackup,
    flushDatabaseBackup
} = await import("./services/databasePersistenceService.js");

await restoreDatabase();

const [
    { default: app },
    { startPaymentCleanupWorker },
    { startOperationsAutomationWorker }
] = await Promise.all([
    import("./app.js"),
    import("./services/paymentCleanupService.js"),
    import("./services/operationsAutomationService.js")
]);
const PORT =
    process.env.PORT || 5000;


const server = app.listen(
    PORT,
    () => {

        console.log(
            `🚀 NutriDust API running on port ${PORT}`
        );


        // =============================================
        // RUN ON SERVER START
        // =============================================

        startPaymentCleanupWorker();
        startOperationsAutomationWorker();
        scheduleDatabaseBackup();

    }
);

const shutdown = signal => {
    console.log(`Received ${signal}; saving database snapshot...`);
    server.close(async () => {
        await flushDatabaseBackup();
        process.exit(0);
    });

    setTimeout(() => process.exit(1), 10000).unref();
};

process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));
