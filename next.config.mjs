/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            hostname: "img.clerk.com"
        }, {
            hostname: "i.ibb.co"
        }, {
            hostname: "img.freepik.com"
        }
        ]
    }
};

export default nextConfig;
