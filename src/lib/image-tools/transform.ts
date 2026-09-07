export type OutputFormat = "image/png" | "image/jpeg";
export type CropRotateOptions = {
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
  rotation: 0 | 90 | 180 | 270;
  format: OutputFormat;
};

type ImageSource = HTMLImageElement;

function loadImage(file: Blob): Promise<ImageSource> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, format: OutputFormat): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Failed to create image"))),
      format,
      format === "image/jpeg" ? 0.92 : undefined,
    );
  });
}

function drawRotated(
  source: HTMLCanvasElement,
  rotation: CropRotateOptions["rotation"],
): HTMLCanvasElement {
  const quarterTurn = rotation === 90 || rotation === 270;
  const canvas = document.createElement("canvas");
  canvas.width = quarterTurn ? source.height : source.width;
  canvas.height = quarterTurn ? source.width : source.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser");

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.drawImage(source, -source.width / 2, -source.height / 2);
  return canvas;
}

export async function cropRotateImage(
  file: Blob,
  options: CropRotateOptions,
): Promise<Blob> {
  const img = await loadImage(file);
  const x = Math.max(0, Math.min(Math.round(options.cropX), img.naturalWidth - 1));
  const y = Math.max(0, Math.min(Math.round(options.cropY), img.naturalHeight - 1));
  const width = Math.max(1, Math.min(Math.round(options.cropWidth), img.naturalWidth - x));
  const height = Math.max(1, Math.min(Math.round(options.cropHeight), img.naturalHeight - y));

  const cropped = document.createElement("canvas");
  cropped.width = width;
  cropped.height = height;
  const cropContext = cropped.getContext("2d");
  if (!cropContext) throw new Error("Canvas is not supported in this browser");
  cropContext.imageSmoothingEnabled = true;
  cropContext.imageSmoothingQuality = "high";
  cropContext.drawImage(img, x, y, width, height, 0, 0, width, height);

  return canvasToBlob(drawRotated(cropped, options.rotation), options.format);
}

export async function resizeToPreset(
  file: Blob,
  width: number,
  height: number,
  mode: "cover" | "contain",
  format: OutputFormat,
): Promise<Blob> {
  if (!Number.isFinite(width) || !Number.isFinite(height) || !Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > 12000 || height > 12000) {
    throw new Error("Image dimensions must be whole numbers between 1 and 12,000 pixels");
  }

  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  if (mode === "contain") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight);
    const drawWidth = Math.round(img.naturalWidth * scale);
    const drawHeight = Math.round(img.naturalHeight * scale);
    ctx.drawImage(img, Math.round((width - drawWidth) / 2), Math.round((height - drawHeight) / 2), drawWidth, drawHeight);
  } else {
    const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
    const drawWidth = Math.round(img.naturalWidth * scale);
    const drawHeight = Math.round(img.naturalHeight * scale);
    ctx.drawImage(img, Math.round((width - drawWidth) / 2), Math.round((height - drawHeight) / 2), drawWidth, drawHeight);
  }

  return canvasToBlob(canvas, format);
}
