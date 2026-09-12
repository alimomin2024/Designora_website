"use client";

import TargetCompressClient from "@/components/TargetCompressClient";

export default function CompressTo100KBPage() {
  return (
    <TargetCompressClient
      defaultTargetKB={100}
      title="Compress Image to 100KB Online Free"
      subtitle="Compress JPG, PNG, and WEBP images to under 100KB without losing visual clarity. Perfect for resumes, admissions, and official documents."
    />
  );
}
