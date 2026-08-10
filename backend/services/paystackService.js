import axios from "axios";


// Initialize Paystack transaction
export const initializePayment = async ({
    email,
    amount,
    reference,
    callbackUrl
}) => {

    try {

        const secretKey =
            process.env.PAYSTACK_SECRET_KEY;


        if (!secretKey) {

            throw new Error(
                "PAYSTACK_SECRET_KEY is not configured."
            );

        }


        const response = await axios.post(

            "https://api.paystack.co/transaction/initialize",

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