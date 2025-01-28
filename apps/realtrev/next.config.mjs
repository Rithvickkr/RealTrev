/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['plus.unsplash.com','via.placeholder.com'], // Add allowed image domains here

    },
    eslint: {
      ignoreDuringBuilds: true,
    }
  };
  
  export default nextConfig;
  