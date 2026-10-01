import type { NextConfig } from "next";
const nextConfig: NextConfig = {
    async headers() {
        return [{ source: "/:path*", headers: [
                    { key: "Referrer-Policy", value: "no-referrer" },
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
                    { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' ws: wss:; object-src 'none'; base-uri 'self'; form-action 'self'" }
                ] }];
    },
};
export default nextConfig;
