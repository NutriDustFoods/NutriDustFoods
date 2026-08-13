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

    if (!secretKey) {

        throw new Error(
            "PAYSTACK_SECRET_KEY is not configured."
        );

    }

    return secretKey;

};


// =====================================================
// INITIALIZE PAYSTACK TRANSACTION
// =====================================================

export const initializePayment = async ({
    email,
    amount,
    reference,
    callbackUrl
}) => {

    try {

        const secretKey =
            getSecretKey();


        const response = await axios.post(

            `${PAYSTACK_BASE_URL}/transaction/initialize`,

            {
                email,

                amount,

                reference,

                callback_url: callbackUrl
            },

            {
                headers: {

                    Authorization:
                        `Bearer ${secretKey}`,

                    "Content-Type":
                        "application/json"

                }

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

            "Unable to initialize Paystack payment."

        );

    }

};



// =====================================================
// VERIFY PAYSTACK TRANSACTION
// =====================================================

export const verifyPayment = async (reference) => {

    try {

        const secretKey =
            getSecretKey();


        if (!reference) {

            throw new Error(
                "Payment reference is required."
            );

        }


        const response = await axios.get(

            `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,

            {

                headers: {

                    Authorization:
                        `Bearer ${secretKey}`,

                    "Content-Type":
                        "application/json"

                }

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

            "Unable to verify Paystack payment."

        );

    }

};