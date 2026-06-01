"use client";

import { useEffect, useMemo, useRef } from "react";

interface Props {
  slot: string;
  format?: string;
  className?: string;
}

export default function AdSlot({ slot, format = "auto", className = "" }: Props) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const provider = (process.env.NEXT_PUBLIC_AD_PROVIDER || "adsense").toLowerCase();

  const adsterraNativeScriptSrc =
    process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_SCRIPT_SRC ||
    "https://pl29504360.effectivecpmnetwork.com/bdfef1dbc99e727aba136cbef3dd9327/invoke.js";
  const adsterraNativeContainerId =
    process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_CONTAINER_ID ||
    "container-bdfef1dbc99e727aba136cbef3dd9327";
  const adsterraBannerKey =
    process.env.NEXT_PUBLIC_ADSTERRA_BANNER_KEY || "b50b25dbf0b50c706e331074c6e7dcb3";
  const adsterraBannerScriptSrc =
    process.env.NEXT_PUBLIC_ADSTERRA_BANNER_SCRIPT_SRC ||
    `https://www.highperformanceformat.com/${adsterraBannerKey}/invoke.js`;

  const rawClient = process.env.NEXT_PUBLIC_ADSENSE_ID || "pub-9874232911110694";
  const adClient = rawClient.startsWith("ca-") ? rawClient : `ca-${rawClient}`;
  const isAdsterraNative = provider === "adsterra" && slot === "home-hero-below";
  const isAdsterraBanner = provider === "adsterra" && slot === "home-tools-below";
  const bannerContainerId = useMemo(() => `adsterra-banner-${slot}`, [slot]);

  useEffect(() => {
    if (provider !== "adsense") return;
    if (pushed.current) return;
    pushed.current = true;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded
    }
  }, [provider]);

  useEffect(() => {
    if (!isAdsterraNative) return;
    const scriptId = "adsterra-native-script";
    if (document.getElementById(scriptId)) return;
    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = adsterraNativeScriptSrc;
    document.body.appendChild(script);
  }, [isAdsterraNative, adsterraNativeScriptSrc]);

  useEffect(() => {
    if (!isAdsterraBanner) return;
    const scriptId = `adsterra-banner-script-${slot}`;
    if (document.getElementById(scriptId)) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).atOptions = {
      key: adsterraBannerKey,
      format: "iframe",
      height: 250,
      width: 300,
      params: {},
    };
    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.src = adsterraBannerScriptSrc;
    document.getElementById(bannerContainerId)?.appendChild(script);
  }, [
    isAdsterraBanner,
    slot,
    adsterraBannerKey,
    adsterraBannerScriptSrc,
    bannerContainerId,
  ]);

  if (isAdsterraNative) {
    return (
      <div className={`my-6 flex justify-center ${className}`}>
        <div id={adsterraNativeContainerId} />
      </div>
    );
  }

  if (isAdsterraBanner) {
    return (
      <div className={`my-6 flex justify-center ${className}`}>
        <div id={bannerContainerId} style={{ width: 300, height: 250 }} />
      </div>
    );
  }

  if (provider === "adsterra") {
    return null;
  }

  return (
    <div className={`my-6 flex justify-center ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
