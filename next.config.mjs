/** @type {import('next').NextConfig} */
const supaHost = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/^https?:\/\//, "");
const nextConfig = {
  allowedDevOrigins: ['192.168.100.161'],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      ...(supaHost ? [{ protocol: "https", hostname: supaHost }] : []),
    ],
  },
};
export default nextConfig;
