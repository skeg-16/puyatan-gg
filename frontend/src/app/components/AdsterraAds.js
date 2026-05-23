"use client";

import { useEffect, useRef } from "react";

export function Adsterra728x90() {
  const adRef = useRef(null);

  useEffect(() => {
    if (!adRef.current) return;
    if (adRef.current.querySelector("script")) return;

    // Adsterra requires atOptions to be globally available
    window.atOptions = {
      key: "b0ac9338a38cb7f265d44e19d30617da",
      format: "iframe",
      height: 90,
      width: 728,
      params: {},
    };

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://www.highperformanceformat.com/b0ac9338a38cb7f265d44e19d30617da/invoke.js";
    script.async = true;

    adRef.current.appendChild(script);
  }, []);

  return (
    <div className="w-full flex justify-center my-2 overflow-hidden">
      <div ref={adRef} className="min-h-[90px] w-[728px] max-w-full flex justify-center bg-black/5 rounded-xl border border-white/5" />
    </div>
  );
}

export function AdsterraNative() {
  const adRef = useRef(null);

  useEffect(() => {
    if (!adRef.current) return;
    // Prevent appending multiple times in React strict mode
    if (adRef.current.querySelector("script")) return;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.dataset.cfasync = "false";
    script.src = "https://pl29524385.effectivecpmnetwork.com/c60e897d404d285822477663f8ca9211/invoke.js";

    adRef.current.appendChild(script);
  }, []);

  return (
    <div className="w-full flex justify-center my-2">
      <div ref={adRef} id="container-c60e897d404d285822477663f8ca9211" className="w-full min-h-[50px] bg-black/5 rounded-xl border border-white/5 flex items-center justify-center text-xs text-white/30" />
    </div>
  );
}

export function Adsterra300x250() {
  const adRef = useRef(null);

  useEffect(() => {
    if (!adRef.current) return;
    if (adRef.current.querySelector("script")) return;

    window.atOptions = {
      key: "98942ed498c52382a5c9296776e8d0d1",
      format: "iframe",
      height: 250,
      width: 300,
      params: {},
    };

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://www.highperformanceformat.com/98942ed498c52382a5c9296776e8d0d1/invoke.js";
    script.async = true;

    adRef.current.appendChild(script);
  }, []);

  return (
    <div className="w-full flex justify-center my-4 overflow-hidden">
      <div ref={adRef} className="min-h-[250px] w-[300px] max-w-full flex justify-center bg-black/5 rounded-xl border border-white/5" />
    </div>
  );
}

export function Adsterra320x50() {
  const adRef = useRef(null);

  useEffect(() => {
    if (!adRef.current) return;
    if (adRef.current.querySelector("script")) return;

    window.atOptions = {
      key: "e7b35ad5a8bf044575b3ca0e94e5668a",
      format: "iframe",
      height: 50,
      width: 320,
      params: {},
    };

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://www.highperformanceformat.com/e7b35ad5a8bf044575b3ca0e94e5668a/invoke.js";
    script.async = true;

    adRef.current.appendChild(script);
  }, []);

  return (
    <div className="w-full flex justify-center my-2 overflow-hidden shrink-0">
      <div ref={adRef} className="min-h-[50px] w-[320px] max-w-full flex justify-center bg-black/5 rounded-xl border border-white/5" />
    </div>
  );
}
