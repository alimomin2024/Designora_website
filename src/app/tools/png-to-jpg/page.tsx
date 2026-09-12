"use client";

import PairConverterClient from "@/components/PairConverterClient";

export default function PngToJpgPage() {
  return (
    <PairConverterClient
      fromFormat="PNG"
      toFormat="JPG"
      targetMime="image/jpeg"
      targetExtension="jpg"
      title="PNG to JPG Converter Free Online"
      subtitle="Convert PNG transparent or opaque images into lightweight JPG files. Adjust quality, shrink file size, and download instantly without uploading to servers."
    />
  );
}
