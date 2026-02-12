/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
      ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
      remotePatterns: [
        {
            protocol: "http",
            hostname: "backend.nhanmac.vn",
            pathname: "/upload/**",
          },
          {
            protocol: "http",
            hostname: "localhost",
            port: "3600",
            pathname: "/upload/**",
          },
          // HTTPS
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