import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo.svg" alt="Designora" width={32} height={32} className="h-8 w-8" />
              <span className="text-lg font-bold gradient-text">Designora</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Professional image tools powered by AI. Resize, upscale, remove backgrounds, erase
              watermarks, compress, convert, and more.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Tools</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/tools/upscale" className="hover:text-primary transition-colors">AI Image Upscaler</Link></li>
              <li><Link href="/tools/4k-photo-editor" className="hover:text-primary transition-colors">4K Photo Editor</Link></li>
              <li><Link href="/tools/background-removal" className="hover:text-primary transition-colors">Background Remover</Link></li>
              <li><Link href="/tools/watermark-removal" className="hover:text-primary transition-colors">Watermark Remover</Link></li>
              <li><Link href="/tools/resize" className="hover:text-primary transition-colors">Image Resizer</Link></li>
              <li><Link href="/tools/crop-rotate" className="hover:text-primary transition-colors">Crop and Rotate</Link></li>
              <li><Link href="/tools/social-media-image-size" className="hover:text-primary transition-colors">Social Media Resizer</Link></li>
              <li><Link href="/tools/compress" className="hover:text-primary transition-colors">Image Compressor</Link></li>
              <li><Link href="/tools/convert" className="hover:text-primary transition-colors">Format Converter</Link></li>
              <li><Link href="/tools/heic-to-jpg" className="hover:text-primary transition-colors">HEIC to JPG</Link></li>
              <li><Link href="/tools/batch-resize" className="hover:text-primary transition-colors">Batch Resizer</Link></li>
              <li><Link href="/tools/palette" className="hover:text-primary transition-colors">Color Palette Extractor</Link></li>
              <li><Link href="/tools/metadata" className="hover:text-primary transition-colors">DPI Editor</Link></li>
              <li><Link href="/tools/pdf" className="hover:text-primary transition-colors">PDF to Image</Link></li>
              <li><Link href="/tools/enhance" className="hover:text-primary transition-colors">AI Image Enhancer</Link></li>
              <li><Link href="/tools/compress-to-50kb" className="hover:text-primary transition-colors">Compress to 50KB</Link></li>
              <li><Link href="/tools/compress-to-100kb" className="hover:text-primary transition-colors">Compress to 100KB</Link></li>
              <li><Link href="/tools/compress-to-20kb" className="hover:text-primary transition-colors">Compress to 20KB</Link></li>
              <li><Link href="/tools/passport-photo-maker" className="hover:text-primary transition-colors">Passport Photo Maker</Link></li>
              <li><Link href="/tools/unblur-image" className="hover:text-primary transition-colors">Unblur Image</Link></li>
              <li><Link href="/tools/jpg-to-pdf" className="hover:text-primary transition-colors">JPG to PDF</Link></li>
              <li><Link href="/tools/pdf-to-jpg" className="hover:text-primary transition-colors">PDF to JPG</Link></li>
              <li><Link href="/tools/png-to-jpg" className="hover:text-primary transition-colors">PNG to JPG</Link></li>
              <li><Link href="/tools/jpg-to-png" className="hover:text-primary transition-colors">JPG to PNG</Link></li>
              <li><Link href="/tools/webp-to-jpg" className="hover:text-primary transition-colors">WEBP to JPG</Link></li>
              <li><Link href="/tools/circle-crop" className="hover:text-primary transition-colors">Circle Crop</Link></li>
              <li><Link href="/tools/flip-image" className="hover:text-primary transition-colors">Flip Image</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/blog" className="hover:text-primary transition-colors">Guides & Tutorials</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Log in</Link></li>
              <li><Link href="/signup" className="hover:text-primary transition-colors">Sign up</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Designora. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
