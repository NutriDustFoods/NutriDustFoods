import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const apiUrl = env.VITE_API_URL || "http://localhost:5000/api";
    return {
        define: {
            __API_URL__: JSON.stringify(apiUrl),
            __API_ORIGIN__: JSON.stringify(apiUrl.replace(/\/api\/?$/, "")),
            __DELIVERY_FEE__: JSON.stringify(Number(env.VITE_DELIVERY_FEE || 1500))
        },
        build: {
            rollupOptions: {
                input: {
                    customer: resolve(process.cwd(), "index.html"),
                    admin: resolve(process.cwd(), "admin.html"),
                    rider: resolve(process.cwd(), "rider.html")
                }
            }
        }
    };
});
