import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const RUNWARE_API = "https://api.runware.ai/v1";

const TIER_CONFIG: Record<string, { scale: 2 | 4; format: string }> = {
  "2k": { scale: 2, format: "PNG" },
  "4k": { scale: 4, format: "PNG" },
};

export async function POST(req: NextRequest) {
  try {
    const limited = applyRateLimit(req, "upscale", 20, 60_000);
    if (limited) return limited;

    const apiKey = process.env.RUNWARE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "RUNWARE_API_KEY not configured" }, { status: 500 });
    }

    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const tier = (formData.get("tier") as string) || "2k";

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const config = TIER_CONFIG[tier];
    if (!config) {
      return NextResponse.json({ error: `Invalid tier: ${tier}` }, { status: 400 });
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const base64 = buffer.toString("base64");
    const mime = imageFile.type || "image/png";
    const dataUrl = `data:${mime};base64,${base64}`;

    const taskUUID = crypto.randomUUID();
    const tasks = [
      {
        taskType: "upscale",
        taskUUID,
        model: "runware:504@1",
        upscaleFactor: config.scale,
        outputFormat: config.format,
        outputType: "URL",
        includeCost: true,
        inputs: { image: dataUrl },
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
        { error: `Runware API error: ${response.status} ${text.slice(0, 200)}` },
        { status: 502 },
      );
    }

    const data = await response.json();
    const results = data.data || [];
    if (!results.length || !results[0].imageURL) {
      return NextResponse.json({ error: "No result from upscaling" }, { status: 502 });
    }

    return NextResponse.json({
      imageURL: results[0].imageURL,
      cost: results[0].cost,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
