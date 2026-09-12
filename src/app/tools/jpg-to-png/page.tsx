"use client";

import PairConverterClient from "@/components/PairConverterClient";

export default function JpgToPngPage() {
  return (
    <PairConverterClient
      fromFormat="JPG"
      toFormat="PNG"
      targetMime="image/png"
      targetExtension="png"
      title="JPG to PNG Converter Free Online"
      subtitle="Convert JPG or JPEG photos to lossless PNG format in your browser. Maintain crisp details with zero loss of quality and no server uploads."
    />
  );
}
