import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog-posts";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://designoraa.in";
const staticContentLastModified = "2026-09-12";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "", priority: 1.0, freq: "daily" as const },
    { path: "/tools", priority: 0.9, freq: "weekly" as const },
    { path: "/tools/upscale", priority: 0.9, freq: "weekly" as const },
    { path: "/tools/4k-photo-editor", priority: 0.9, freq: "weekly" as const },
    { path: "/tools/background-removal", priority: 0.9, freq: "weekly" as const },
    { path: "/tools/watermark-removal", priority: 0.9, freq: "weekly" as const },
    { path: "/tools/resize", priority: 0.8, freq: "weekly" as const },
    { path: "/tools/crop-rotate", priority: 0.8, freq: "weekly" as const },
    { path: "/tools/social-media-image-size", priority: 0.8, freq: "weekly" as const },
    { path: "/tools/compress", priority: 0.8, freq: "weekly" as const },
    { path: "/tools/convert", priority: 0.8, freq: "weekly" as const },
    { path: "/tools/heic-to-jpg", priority: 0.8, freq: "weekly" as const },
    { path: "/tools/batch-resize", priority: 0.7, freq: "weekly" as const },
    { path: "/tools/palette", priority: 0.7, freq: "weekly" as const },
    { path: "/tools/metadata", priority: 0.7, freq: "weekly" as const },
    { path: "/tools/pdf", priority: 0.7, freq: "weekly" as const },
    { path: "/tools/enhance", priority: 0.7, freq: "weekly" as const },
    { path: "/blog", priority: 0.8, freq: "weekly" as const },
    { path: "/pricing", priority: 0.6, freq: "monthly" as const },
    { path: "/privacy-policy", priority: 0.3, freq: "yearly" as const },
    { path: "/terms-of-service", priority: 0.3, freq: "yearly" as const },
  ].map((route) => ({ ...route, lastModified: staticContentLastModified }));

  const blogRoutes = blogPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    priority: 0.6,
    freq: "monthly" as const,
    lastModified: post.date,
  }));

  return [...staticRoutes, ...blogRoutes].map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: route.lastModified,
    changeFrequency: route.freq,
    priority: route.priority,
  }));
}
