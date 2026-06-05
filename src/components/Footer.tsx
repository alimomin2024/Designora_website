import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
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
              <li><Link href="/tools/background-removal" className="hover:text-primary transition-colors">Background Remover</Link></li>
              <li><Link href="/tools/watermark-removal" className="hover:text-primary transition-colors">Watermark Remover</Link></li>
              <li><Link href="/tools/resize" className="hover:text-primary transition-colors">Image Resizer</Link></li>
              <li><Link href="/tools/compress" className="hover:text-primary transition-colors">Image Compressor</Link></li>
              <li><Link href="/tools/convert" className="hover:text-primary transition-colors">Format Converter</Link></li>
              <li><Link href="/tools/batch-resize" className="hover:text-primary transition-colors">Batch Resizer</Link></li>
              <li><Link href="/tools/palette" className="hover:text-primary transition-colors">Color Palette Extractor</Link></li>
              <li><Link href="/tools/metadata" className="hover:text-primary transition-colors">DPI Editor</Link></li>
              <li><Link href="/tools/pdf" className="hover:text-primary transition-colors">PDF to Image</Link></li>
              <li><Link href="/tools/enhance" className="hover:text-primary transition-colors">AI Image Enhancer</Link></li>
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
