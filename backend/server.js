import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import "./config/sqlite.js";

import {
    startPaymentCleanupWorker
} from "./services/paymentCleanupService.js";
import { startOperationsAutomationWorker } from "./services/operationsAutomationService.js";
const PORT =
    process.env.PORT || 5000;


app.listen(
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

    }
);
