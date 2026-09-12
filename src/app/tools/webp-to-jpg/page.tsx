"use client";

import PairConverterClient from "@/components/PairConverterClient";

export default function WebpToJpgPage() {
  return (
    <PairConverterClient
      fromFormat="WEBP"
      toFormat="JPG"
      targetMime="image/jpeg"
      targetExtension="jpg"
      title="WEBP to JPG Converter Free Online"
      subtitle="Convert modern WEBP web images to universally compatible JPG files. Works locally in your browser for fast, private batch conversion."
    />
  );
}
