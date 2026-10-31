import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Cho phép upload PDF ebook + ảnh bìa qua Server Actions (mặc định chỉ 1MB)
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  // Tránh Next.js nhầm root với thư mục home khi có package-lock ở ngoài project
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dlcqttwdoyimstkwdmgu.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
