/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            hostname: "img.clerk.com"
        }, {
            hostname: "i.ibb.co"
        }]
    }
};

export default nextConfig;
