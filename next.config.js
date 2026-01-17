/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      domains: ['backend.nhanmac.vn','luattiendat.com.vn'],
    },
  }
  
  module.exports = nextConfig