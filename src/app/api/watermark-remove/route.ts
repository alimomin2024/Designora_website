import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const RUNWARE_API = "https://api.runware.ai/v1";

function roundTo8(n: number) {
  return Math.round(n / 8) * 8;
}

export async function POST(req: NextRequest) {
  try {
    const limited = applyRateLimit(req, "watermark-remove", 20, 60_000);
    if (limited) return limited;

    const apiKey = process.env.RUNWARE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "RUNWARE_API_KEY not configured" }, { status: 500 });
    }

    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const maskFile = formData.get("mask") as File | null;
    const widthRaw = parseInt(formData.get("width") as string, 10) || 1024;
    const heightRaw = parseInt(formData.get("height") as string, 10) || 1024;

    if (!imageFile || !maskFile) {
      return NextResponse.json({ error: "Image and mask required" }, { status: 400 });
    }

    const maxDim = 2048;
    let w = widthRaw;
    let h = heightRaw;
    if (w > maxDim || h > maxDim) {
      const scale = maxDim / Math.max(w, h);
      w = Math.round(w * scale);
      h = Math.round(h * scale);
    }
    w = Math.max(64, roundTo8(w));
    h = Math.max(64, roundTo8(h));

    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const maskBuffer = Buffer.from(await maskFile.arrayBuffer());
    const imageBase64 = `data:image/png;base64,${imageBuffer.toString("base64")}`;
    const maskBase64 = `data:image/png;base64,${maskBuffer.toString("base64")}`;

    const taskUUID = crypto.randomUUID();
    const tasks = [
      {
        taskType: "imageInference",
        taskUUID,
        positivePrompt: "clean surface, natural texture, seamless fill, photorealistic",
        negativePrompt: "text, watermark, logo, artifact, distortion",
        seedImage: imageBase64,
        maskImage: maskBase64,
        model: "civitai:403361@456538",
        width: w,
        height: h,
        strength: 0.85,
        steps: 30,
        outputType: "URL",
        outputFormat: "PNG",
        includeCost: true,
      },
    ];

    const response = await fetch(RUNWARE_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tasks),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: `Runware API error: ${response.status} ${text.slice(0, 300)}` },
        { status: 502 },
      );
    }

    const data = await response.json();
    const results = data.data || [];
    if (!results.length || !results[0].imageURL) {
      const errDetail = JSON.stringify(data.errors || data).slice(0, 300);
      return NextResponse.json({ error: `No result from inpainting: ${errDetail}` }, { status: 502 });
    }

    return NextResponse.json({ imageURL: results[0].imageURL, cost: results[0].cost });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
