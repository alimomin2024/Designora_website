export const toolSeoData = {
  upscale: {
    toolName: "upscale",
    headline: "Free AI Image Upscaler — Enhance Photos to 2K & 4K Online",
    description:
      "Designora's AI image upscaler uses Real-ESRGAN deep learning to enlarge photos up to 4x while preserving sharpness and detail. Upload any low-resolution image and get a crisp, high-quality version in seconds. No software to install — works directly in your browser. Perfect for enhancing product photos, artwork, old pictures, and social media images.",
    steps: [
      "Upload your image (PNG, JPG, or WEBP up to 20 MB).",
      "Select your upscale tier: 2K, 4K, or 4K with 600 DPI for print.",
      "Click Upscale and wait a few seconds for AI processing.",
      "Download your enhanced high-resolution image.",
    ],
    useCases: [
      "Enlarge product photos for ecommerce listings on Amazon, Etsy, or Shopify.",
      "Upscale old family photos to modern resolution for printing.",
      "Enhance artwork and illustrations for high-DPI displays.",
      "Improve social media images for Instagram, Pinterest, and Facebook.",
      "Prepare images for large-format prints and posters.",
    ],
    faqs: [
      { q: "Is the AI image upscaler free?", a: "All non-AI tools on Designora are free and unlimited. AI upscaling uses affordable credits starting at just 1 credit per use." },
      { q: "What is the maximum upscale factor?", a: "You can upscale images up to 4x their original resolution, producing 4K quality output with optional 600 DPI for print." },
      { q: "Does upscaling reduce image quality?", a: "No — Real-ESRGAN AI adds realistic detail and sharpness during upscaling, unlike simple interpolation which causes blur." },
      { q: "What image formats are supported?", a: "PNG, JPG, and WEBP images up to 20 MB." },
    ],
  },

  "background-removal": {
    toolName: "background-removal",
    headline: "AI Background Remover — Remove Image Background Online Free",
    description:
      "Remove backgrounds from images instantly using AI-powered segmentation. Designora uses BiRefNet deep learning to detect subjects and create clean transparent PNG cutouts in one click. No manual selection needed — just upload and download. Ideal for product photography, profile pictures, marketing materials, and ecommerce listings.",
    steps: [
      "Upload your image (PNG, JPG, or WEBP).",
      "AI automatically detects the subject and removes the background.",
      "Preview the transparent result.",
      "Download the clean PNG with transparent background.",
    ],
    useCases: [
      "Create white-background product photos for Amazon, eBay, and Shopify.",
      "Make transparent logos and graphics for presentations.",
      "Remove distracting backgrounds from profile pictures.",
      "Prepare images for photo compositing and graphic design.",
      "Create clean cutouts for social media posts and ads.",
    ],
    faqs: [
      { q: "Can I remove backgrounds for free?", a: "AI background removal uses credits. You can earn free credits with coupon codes or purchase 100 credits for just $1." },
      { q: "Does it work with complex backgrounds?", a: "Yes — the BiRefNet AI model handles complex backgrounds, hair detail, and semi-transparent objects with high accuracy." },
      { q: "What format is the output?", a: "Transparent PNG so you can place the subject on any background." },
      { q: "Is there a file size limit?", a: "Images up to 20 MB in PNG, JPG, or WEBP format are supported." },
    ],
  },

  "watermark-removal": {
    toolName: "watermark-removal",
    headline: "AI Watermark Remover — Remove Text & Logos from Images Online",
    description:
      "Remove watermarks, text overlays, and logos from images using AI inpainting technology. Paint over the area you want to remove and Designora's AI fills it in with natural-looking content that blends seamlessly with the surrounding image. The result preserves the original photo quality and resolution.",
    steps: [
      "Upload your image with the watermark.",
      "Use the brush tool to paint over the watermark area.",
      "Adjust brush size for precision.",
      "Click Remove Watermark and let AI inpaint the area.",
      "Download the clean result.",
    ],
    useCases: [
      "Remove stock photo watermarks from preview images.",
      "Clean up text overlays and date stamps from photos.",
      "Remove unwanted logos from screenshots.",
      "Fix images with accidental text or stamp marks.",
    ],
    faqs: [
      { q: "How does AI watermark removal work?", a: "You paint a mask over the watermark area. The AI then uses inpainting to generate realistic content that matches the surrounding pixels." },
      { q: "Does it change the image resolution?", a: "The output matches your original image dimensions — no resolution loss." },
      { q: "Can it remove transparent watermarks?", a: "Yes, as long as you paint over the visible watermark area, the AI can fill it in naturally." },
      { q: "How many credits does it cost?", a: "Watermark removal costs 4 credits per use due to the AI processing involved." },
    ],
  },

  resize: {
    toolName: "resize",
    headline: "Image Resizer Online Free — Resize JPG, PNG, WEBP Instantly",
    description:
      "Resize images to exact pixel dimensions online for free. Designora's image resizer works entirely in your browser — no upload to servers, no quality loss. Set custom width and height, maintain aspect ratio, and download instantly. Works with JPG, PNG, and WEBP formats.",
    steps: [
      "Upload your image (PNG, JPG, or WEBP).",
      "Enter your desired width and height in pixels.",
      "Toggle aspect ratio lock to maintain proportions.",
      "Click Resize and download the result.",
    ],
    useCases: [
      "Resize images for social media dimensions (Instagram 1080x1080, Facebook cover 820x312).",
      "Prepare product images for ecommerce platforms with specific size requirements.",
      "Resize photos for website thumbnails and banners.",
      "Adjust profile picture dimensions for different platforms.",
      "Batch prepare images for email marketing templates.",
    ],
    faqs: [
      { q: "Is image resizing free?", a: "Yes — resizing is a standard tool eligible for 3 free daily uses, then 1 credit per use." },
      { q: "Does resizing reduce image quality?", a: "Designora uses high-quality browser-based resampling to minimize quality loss during resizing." },
      { q: "Can I resize without changing aspect ratio?", a: "Yes, toggle the aspect ratio lock to maintain the original proportions while changing dimensions." },
      { q: "Is my image uploaded to a server?", a: "No — image resizing happens entirely in your browser. Your images never leave your device." },
    ],
  },

  compress: {
    toolName: "compress",
    headline: "Image Compressor Online — Reduce JPG PNG File Size Free",
    description:
      "Compress images online to reduce file size while keeping visual quality. Adjust the quality slider to find the perfect balance between file size and appearance. Works with JPG, PNG, and WEBP images directly in your browser — no uploads to external servers. Similar to TinyPNG but with full quality control.",
    steps: [
      "Upload your image.",
      "Adjust the quality slider (lower = smaller file size).",
      "Preview the compressed result and compare file sizes.",
      "Download the optimized image.",
    ],
    useCases: [
      "Optimize website images for faster page load speed and better SEO.",
      "Reduce email attachment sizes.",
      "Compress product photos for ecommerce upload limits.",
      "Shrink images for mobile-friendly web design.",
      "Batch optimize images for blog posts and articles.",
    ],
    faqs: [
      { q: "How much can I reduce file size?", a: "Typically 50-80% reduction depending on the quality setting and image content." },
      { q: "Does compression lose image quality?", a: "Some quality reduction occurs at lower settings, but the visual difference is often imperceptible. Use the preview to find your ideal balance." },
      { q: "Is compression processed locally?", a: "Yes — compression happens entirely in your browser. Your images are never uploaded to our servers." },
      { q: "What formats can I compress?", a: "JPG, PNG, and WEBP images are all supported." },
    ],
  },

  convert: {
    toolName: "convert",
    headline: "Image Format Converter Online — PNG to JPG, WEBP Converter Free",
    description:
      "Convert image formats online instantly. Change between PNG, JPG, and WEBP formats with one click. All conversion happens in your browser — fast, private, and free. Perfect for converting PNG screenshots to JPG for smaller file sizes, or creating WEBP images for modern web performance.",
    steps: [
      "Upload your image in any supported format.",
      "Select the target format: PNG, JPG, or WEBP.",
      "Click Convert to process the image.",
      "Download your converted image.",
    ],
    useCases: [
      "Convert PNG screenshots to JPG for smaller email attachments.",
      "Create WEBP versions of images for faster website loading.",
      "Convert WEBP images to PNG or JPG for compatibility with older software.",
      "Batch convert images between formats for design workflows.",
    ],
    faqs: [
      { q: "Is the format converter free?", a: "Yes — 3 free daily uses, then 1 credit per conversion." },
      { q: "Does converting formats lose quality?", a: "Converting to JPG involves lossy compression; PNG and WEBP can be lossless. Choose based on your quality needs." },
      { q: "Can I convert WEBP to PNG?", a: "Yes — convert between any combination of PNG, JPG, and WEBP." },
      { q: "Are my images uploaded to a server?", a: "No — all conversion happens locally in your browser." },
    ],
  },

  "batch-resize": {
    toolName: "batch-resize",
    headline: "Batch Image Resizer — Resize Multiple Images at Once Online",
    description:
      "Resize multiple images at once to the same target dimensions. Upload a batch of photos, set your desired width and height, and download all resized images in one go. Saves hours compared to resizing images one by one. All processing happens in your browser.",
    steps: [
      "Upload multiple images at once.",
      "Set the target width and height for all images.",
      "Click Resize All to process the batch.",
      "Download each resized image individually.",
    ],
    useCases: [
      "Prepare product image sets for ecommerce platforms with uniform dimensions.",
      "Resize photo galleries for website grids.",
      "Standardize image sizes for presentations and catalogs.",
      "Batch resize social media images for consistent posting.",
    ],
    faqs: [
      { q: "How many images can I batch resize?", a: "You can upload and resize multiple images at once — processing happens locally so there's no server limit." },
      { q: "Does batch resize maintain quality?", a: "Yes — high-quality browser resampling is used for each image." },
      { q: "Can I set different sizes for each image?", a: "Currently batch resize applies the same dimensions to all images. Use the single resize tool for individual sizing." },
    ],
  },

  palette: {
    toolName: "palette",
    headline: "Color Palette Extractor — Extract Colors from Image Online",
    description:
      "Extract dominant colors from any image to generate a color palette. Designora uses k-means clustering to identify the most prominent colors in your photo. Copy hex codes for use in graphic design, web design, branding, and creative projects.",
    steps: [
      "Upload any image.",
      "The tool analyzes pixels and extracts dominant colors using k-means clustering.",
      "View the generated color palette with hex codes.",
      "Copy individual color codes for your design projects.",
    ],
    useCases: [
      "Extract brand colors from logos and marketing materials.",
      "Generate color schemes from inspiration photos for web design.",
      "Create consistent palettes for social media branding.",
      "Analyze color composition in photography and art.",
    ],
    faqs: [
      { q: "How many colors are extracted?", a: "The tool extracts the dominant colors from your image, typically 5-8 prominent colors." },
      { q: "Can I copy hex codes?", a: "Yes — each extracted color displays its hex code which you can copy for use in any design tool." },
      { q: "Does this work with any image?", a: "Yes — upload any JPG, PNG, or WEBP image to extract its color palette." },
    ],
  },

  metadata: {
    toolName: "metadata",
    headline: "Image Metadata & DPI Editor Online — View and Edit EXIF Data",
    description:
      "View image metadata including dimensions, file size, and format. Edit DPI settings to prepare images for print. Change DPI from screen resolution (72/96 DPI) to print-ready (300/600 DPI) without altering pixel dimensions. Essential for designers and photographers preparing files for professional printing.",
    steps: [
      "Upload your image to view its metadata.",
      "Review dimensions, file size, format, and current DPI.",
      "Enter a new DPI value (e.g. 300 for standard print, 600 for high-quality print).",
      "Download the image with updated DPI metadata.",
    ],
    useCases: [
      "Set 300 DPI for standard print-quality images.",
      "Prepare artwork at 600 DPI for large-format printing.",
      "Check image dimensions and file size before uploading to platforms.",
      "View EXIF data from camera photos.",
    ],
    faqs: [
      { q: "Does changing DPI change the image size?", a: "No — changing DPI only updates the metadata tag. Pixel dimensions remain the same." },
      { q: "What DPI should I use for printing?", a: "300 DPI is standard for most prints. Use 600 DPI for high-quality or large-format output." },
      { q: "Can I view camera EXIF data?", a: "Yes — the tool displays available metadata including dimensions, format, and size." },
    ],
  },

  pdf: {
    toolName: "pdf",
    headline: "PDF to Image Converter Online — Convert PDF Pages to PNG Free",
    description:
      "Convert PDF documents to high-quality PNG images, or combine multiple images into a single PDF file. The PDF to image converter renders each page at 2x resolution for crisp output. The image to PDF tool preserves original dimensions and quality. All processing happens in your browser.",
    steps: [
      "Choose mode: PDF to Image or Image to PDF.",
      "For PDF to Image: upload a PDF file and each page is converted to a PNG.",
      "For Image to PDF: select multiple images to combine into one PDF.",
      "Download the result — individual page images or a combined PDF.",
    ],
    useCases: [
      "Convert PDF presentations to images for social media sharing.",
      "Extract pages from PDF documents as individual images.",
      "Combine product photos into a single PDF catalog.",
      "Convert scanned documents to editable image formats.",
      "Create PDF portfolios from image collections.",
    ],
    faqs: [
      { q: "Is PDF to image conversion free?", a: "Yes — 3 free daily uses for this standard tool, then 1 credit per conversion." },
      { q: "What quality are the converted images?", a: "Pages are rendered at 2x resolution for crisp, high-quality PNG output." },
      { q: "Can I convert multi-page PDFs?", a: "Yes — each page of your PDF is converted to a separate PNG image." },
      { q: "Are my files uploaded to a server?", a: "No — all PDF processing happens locally in your browser using pdf.js." },
    ],
  },

  enhance: {
    toolName: "enhance",
    headline: "AI Image Enhancer Online — Improve Photo Quality Free",
    description:
      "Automatically enhance photo quality with AI-powered adjustments. Designora's image enhancer applies intelligent brightness correction, contrast optimization, and sharpness enhancement to make dull or dark photos look vibrant and professional. One-click enhancement with no manual editing needed.",
    steps: [
      "Upload your image.",
      "The AI analyzes brightness, contrast, and sharpness levels.",
      "View the enhanced before/after comparison.",
      "Download the improved image.",
    ],
    useCases: [
      "Fix underexposed or dark photos from indoor shooting.",
      "Enhance product photos to look more professional.",
      "Improve old or faded photographs.",
      "Quickly optimize images before posting on social media.",
      "Batch enhance photos for portfolio presentations.",
    ],
    faqs: [
      { q: "What does the AI enhancer do?", a: "It automatically adjusts brightness, contrast, and sharpness using histogram analysis to produce a balanced, vibrant result." },
      { q: "Can I control the enhancement level?", a: "Currently the tool applies optimized auto-enhancement. Manual sliders may be added in a future update." },
      { q: "Does it work on all image types?", a: "Yes — photos, screenshots, artwork, and any JPG, PNG, or WEBP image can be enhanced." },
    ],
  },
} as const;
