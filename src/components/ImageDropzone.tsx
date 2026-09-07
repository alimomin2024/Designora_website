"use client";

import { useCallback, useState, type ReactNode } from "react";
import { Upload, ImageIcon } from "lucide-react";

interface Props {
  onFile: (file: File) => void;
  accept?: string;
  children?: ReactNode;
}

export default function ImageDropzone({
  onFile,
  accept = "image/*",
  children,
}: Props) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && (file.type.startsWith("image/") || /\.(heic|heif)$/i.test(file.name))) onFile(file);
    },
    [onFile],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFile(file);
    },
    [onFile],
  );

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-all duration-200 ${
        dragging
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-border hover:border-primary/40 hover:bg-primary/5"
      }`}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="sr-only"
      />
      {children || (
        <>
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            {dragging ? (
              <ImageIcon className="h-7 w-7 text-primary" />
            ) : (
              <Upload className="h-7 w-7 text-primary" />
            )}
          </div>
          <p className="text-sm font-medium">
            {dragging ? "Drop your image here" : "Drag & drop an image, or click to browse"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PNG, JPG, WEBP up to 20 MB
          </p>
        </>
      )}
    </label>
  );
}
