/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "via.placeholder.com"
      },
      {
        hostname: "picsum.photos"
      },
    ]
  }
};

export default nextConfig;
