import Link from "next/link";
import Image from "next/image";
import { Share2 } from "lucide-react";

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
              Professional image tools powered by AI and client-side web technology. Resize, upscale, remove backgrounds, erase
              watermarks, compress, convert, and more.
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 font-medium text-foreground"><Share2 className="h-3.5 w-3.5" /> Share:</span>
              <a
                href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fdesignoraa.in&text=Check%20out%20Designora%20-%20Free%20AI%20Image%20Tools%20Online"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                X (Twitter)
              </a>
              <a
                href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fdesignoraa.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://www.reddit.com/submit?url=https%3A%2F%2Fdesignoraa.in&title=Designora%20-%20Free%20AI%20Image%20Tools%20Online"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Reddit
              </a>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-foreground uppercase tracking-wider">Tools</p>
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
            <p className="mb-3 text-sm font-semibold text-foreground uppercase tracking-wider">Resources</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/blog" className="hover:text-primary transition-colors">Guides & Tutorials</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing Plans</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Member Log In</Link></li>
              <li><Link href="/signup" className="hover:text-primary transition-colors">Create Free Account</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-foreground uppercase tracking-wider">Legal</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground space-y-1">
          <p>&copy; {new Date().getFullYear()} Designora. All rights reserved.</p>
          <p>
            Privacy-first in-browser processing built with modern{" "}
            <a
              href="https://webassembly.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              WebAssembly
            </a>{" "}
            and HTML5 Canvas standards.
          </p>
        </div>
      </div>
    </footer>
  );
}
