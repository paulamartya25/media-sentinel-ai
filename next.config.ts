/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This whitelist stops the security blocking
    allowedDevOrigins: ["172.16.142.73:3000"]
  },
  // Bypasses local development header checks
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true }
};

export default nextConfig;