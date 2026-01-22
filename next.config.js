/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "backend.nhanmac.vn",
                pathname: "/upload/**",
            },
            {
                protocol: "https",
                hostname: "luattiendat.com.vn",
                pathname: "/wp-content/**",
            },
        ],
    },
};

module.exports = nextConfig;
