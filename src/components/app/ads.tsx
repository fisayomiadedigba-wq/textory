'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

/** Grid of 4 native poster ads for home page with multiple banners */
export function NativeAdGrid() {
  return (
    <div className="my-6 px-4 md:px-6">
      <div className="flex gap-4 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <NativePosterAd key={i} />
        ))}
      </div>
      {/* Multiple banners */}
      <div className="my-4 flex flex-col gap-4 items-center">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-[300px] h-[250px]">
            <NativePosterAd />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Footer banner - 300x250 */
export function FooterBanner() {
  return (
    <div className="my-6 mx-4 md:mx-6">
      <div className="w-full max-w-[300px] mx-auto">
        <NativePosterAd />
      </div>
    </div>
  );
}

/** Sticky sidebar ad with close button */
export function StickySidebarAd() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="relative w-[140px] md:w-[160px] overflow-hidden rounded-lg bg-pal-elevated border border-white/10 shadow-lg">
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Close ad"
          className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white/70 hover:bg-black/70 hover:text-white transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
        <div className="p-3 pt-8">
          <p className="text-[10px] text-pal-subdued uppercase tracking-wider mb-1">Ad</p>
          <div className="h-[300px] rounded bg-gradient-to-br from-pal-highlight to-pal-elevated flex items-center justify-center border border-white/10">
            <p className="text-xs font-bold text-pal-text text-center px-2">160x300<br/>Sidebar Ad</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 300x250 banner ad */
export function NativePosterAd() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://bauval.org/21/5d61c4106794fb6d7d92c75ce9c80650';
    
    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      if (containerRef.current && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-[136px] shrink-0 md:w-[164px]">
      <div ref={containerRef} id="container-5d61c4106794fb6d7d92c75ce9c80650" className="aspect-[3/2]"></div>
    </div>
  );
}

/** In-story ad for the reader - banners at end of story/episode */
export function InStoryAd() {
  return (
    <div className="my-8 mx-auto max-w-2xl">
      <div className="flex flex-col gap-4 items-center">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-[300px] h-[250px]">
            <NativePosterAd />
          </div>
        ))}
      </div>
    </div>
  );
}
