import axios from "axios";


// =====================================================
// PAYSTACK CONFIGURATION
// =====================================================

const PAYSTACK_BASE_URL =
    "https://api.paystack.co";


// =====================================================
// GET PAYSTACK SECRET KEY
// =====================================================

const getSecretKey = () => {

    const secretKey =
        process.env.PAYSTACK_SECRET_KEY;


    if (
        !secretKey ||
        String(secretKey).trim() === ""
    ) {

        throw new Error(
            "PAYSTACK_SECRET_KEY is not configured."
        );

    }


    return String(
        secretKey
    ).trim();

};


// =====================================================
// PAYSTACK REQUEST HEADERS
// =====================================================

const getHeaders = () => {

    return {

        Authorization:
            `Bearer ${getSecretKey()}`,

        "Content-Type":
            "application/json",

        Accept:
            "application/json"

    };

};


// =====================================================
// INITIALIZE PAYSTACK TRANSACTION
// =====================================================
//
// Amount MUST be supplied in KOBO.
//
// Example:
//
// ₦5,000
//
// becomes:
//
// 500000 kobo
//
// =====================================================

export const initializePayment = async ({
    email,
    amount,
    reference,
    callbackUrl
}) => {

    try {

        // =================================================
        // VALIDATE EMAIL
        // =================================================

        if (
            !email ||
            String(email).trim() === ""
        ) {

            throw new Error(
                "Customer email is required."
            );

        }


        // =================================================
        // VALIDATE AMOUNT
        // =================================================

        const numericAmount =
            Number(amount);


        if (
            !Number.isFinite(
                numericAmount
            ) ||
            numericAmount <= 0
        ) {

            throw new Error(
                "A valid payment amount is required."
            );

        }


        // =================================================
        // VALIDATE REFERENCE
        // =================================================

        if (
            !reference ||
            String(reference).trim() === ""
        ) {

            throw new Error(
                "Payment reference is required."
            );

        }


        // =================================================
        // PREPARE PAYSTACK REQUEST
        // =================================================

        const payload = {

            email:
                String(
                    email
                ).trim(),

            amount:
                Math.round(
                    numericAmount
                ),

            reference:
                String(
                    reference
                ).trim()

        };


        // =================================================
        // CALLBACK URL
        // =================================================

        if (
            callbackUrl &&
            String(callbackUrl).trim() !== ""
        ) {

            payload.callback_url =
                String(
                    callbackUrl
                ).trim();

        }


        console.log(
            "💳 Sending Paystack initialization request:",
            {

                email:
                    payload.email,

                amount:
                    payload.amount,

                reference:
                    payload.reference

            }
        );


        // =================================================
        // CALL PAYSTACK
        // =================================================

        const response =
            await axios.post(

                `${PAYSTACK_BASE_URL}/transaction/initialize`,

                payload,

                {

                    headers:
                        getHeaders(),

                    timeout:
                        30000

                }

            );


        // =================================================
        // VALIDATE PAYSTACK RESPONSE
        // =================================================

        if (
            !response.data ||
            response.data.status !== true ||
            !response.data.data
        ) {

            throw new Error(

                response.data?.message ||

                "Paystack could not initialize the payment."

            );

        }


        console.log(
            "✅ Paystack transaction initialized:",
            {

                reference:
                    response.data.data.reference

            }
        );


        return response.data;


    } catch (error) {

        console.error(
            "❌ Paystack Initialization Error:",
            error.response?.data ||
            error.message
        );


        throw new Error(

            error.response?.data?.message ||

            error.message ||

            "Unable to initialize Paystack payment."

        );

    }

};


// =====================================================
// VERIFY PAYSTACK TRANSACTION
// =====================================================
//
// Paystack verifies the transaction using the secret
// key stored on the backend.
//
// =====================================================

export const verifyPayment = async (
    reference
) => {

    try {

        // =================================================
        // VALIDATE REFERENCE
        // =================================================

        if (
            !reference ||
            String(reference).trim() === ""
        ) {

            throw new Error(
                "Payment reference is required."
            );

        }


        const cleanReference =
            String(
                reference
            ).trim();


        console.log(
            "🔍 Sending Paystack verification request:",
            cleanReference
        );


        // =================================================
        // CALL PAYSTACK
        // =================================================

        const response =
            await axios.get(

                `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(
                    cleanReference
                )}`,

                {

                    headers:
                        getHeaders(),

                    timeout:
                        30000

                }

            );


        // =================================================
        // VALIDATE RESPONSE
        // =================================================

        if (
            !response.data ||
            response.data.status !== true ||
            !response.data.data
        ) {

            throw new Error(

                response.data?.message ||

                "Paystack could not verify the payment."

            );

        }


        console.log(
            "✅ Paystack transaction verified:",
            {

                reference:
                    response.data.data.reference,

                status:
                    response.data.data.status,

                amount:
                    response.data.data.amount

            }
        );


        return response.data;


    } catch (error) {

        console.error(
            "❌ Paystack Verification Error:",
            error.response?.data ||
            error.message
        );


        throw new Error(

            error.response?.data?.message ||

            error.message ||

            "Unable to verify Paystack payment."

        );

    }

};


// =====================================================
// EXPORT PAYSTACK BASE URL
// =====================================================
//
// Not required by the application, but useful if we
// later need additional Paystack services.
//
// =====================================================

export {
    PAYSTACK_BASE_URL
};

const paystackRequest = async config => {
    try {
        const response = await axios({ baseURL:PAYSTACK_BASE_URL, headers:getHeaders(), timeout:30000, ...config });
        if (!response.data?.status) throw new Error(response.data?.message || "Paystack request failed.");
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || "Paystack request failed.");
    }
};

const offlineTest=()=>process.env.NODE_ENV==="test"&&!process.env.PAYSTACK_SECRET_KEY;
export const listNigerianBanks = () => offlineTest()?Promise.resolve([{name:"Test Bank",code:"058",active:true}]):paystackRequest({ method:"GET", url:"/bank?currency=NGN&country=nigeria&perPage=100" });
export const resolveNigerianAccount = (accountNumber, bankCode) => offlineTest()?Promise.resolve({account_number:accountNumber,account_name:"Test Rider",bank_code:bankCode}):paystackRequest({ method:"GET", url:`/bank/resolve?account_number=${encodeURIComponent(accountNumber)}&bank_code=${encodeURIComponent(bankCode)}` });
export const createTransferRecipient = ({ name, accountNumber, bankCode }) => offlineTest()?Promise.resolve({recipient_code:`RCP_TEST_${accountNumber}`,name,bank_code:bankCode}):paystackRequest({ method:"POST", url:"/transferrecipient", data:{ type:"nuban", name, account_number:accountNumber, bank_code:bankCode, currency:"NGN" } });
export const initiateTransfer = ({ amount, recipient, reference, reason }) => {const key=String(process.env.PAYSTACK_SECRET_KEY||"");if(key.startsWith("sk_live_")&&String(process.env.ENABLE_LIVE_PAYOUTS).toLowerCase()!=="true")return Promise.reject(new Error("Live rider payouts are locked. Complete company verification and explicitly enable live payouts first."));return offlineTest()?Promise.resolve({reference,status:"pending",amount,recipient,reason}):paystackRequest({ method:"POST", url:"/transfer", data:{ source:"balance", amount:Math.round(Number(amount)*100), recipient, reference, reason } });};
