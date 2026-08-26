import { createClient } from "@supabase/supabase-js";

let client;

export const isSupabaseConfigured = () =>
    Boolean(
        process.env.SUPABASE_URL &&
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

export const getSupabaseClient = () => {
    if (!isSupabaseConfigured()) {
        return null;
    }

    if (!client) {
        client = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
            {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false
                }
            }
        );
    }

    return client;
};
