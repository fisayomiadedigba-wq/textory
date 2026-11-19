'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

/** Grid of 5 native poster ads for home page */
export function NativeAdGrid() {
  return (
    <div className="my-6 px-4 md:px-6">
      <div className="flex gap-4 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <NativePosterAd key={i} />
        ))}
      </div>
    </div>
  );
}

/** Footer banner - 300x250 mobile, 728x90 desktop */
export function FooterBanner() {
  return (
    <div className="my-6 mx-4 md:mx-6">
      <div className="relative h-[250px] md:h-[90px] w-full max-w-[728px] mx-auto overflow-hidden rounded-lg bg-gradient-to-r from-pal-elevated to-pal-highlight border border-white/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs text-pal-subdued uppercase tracking-wider mb-1">Advertisement</p>
            <p className="text-lg font-bold text-pal-text">Your Ad Here</p>
            <p className="text-sm text-pal-subdued">Footer Banner</p>
          </div>
        </div>
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

/** Native poster-sized ad (same size as story cards) */
export function NativePosterAd() {
  return (
    <div className="w-[136px] shrink-0 md:w-[164px]">
      <div className="aspect-[2/3] rounded-md bg-gradient-to-br from-pal-highlight to-pal-elevated flex items-center justify-center border border-white/10">
        <div className="text-center px-2">
          <p className="text-[10px] text-pal-subdued uppercase tracking-wider mb-1">Ad</p>
          <p className="text-xs font-bold text-pal-text">Your Ad</p>
        </div>
      </div>
    </div>
  );
}

/** In-story ad for the reader - now uses poster size */
export function InStoryAd() {
  return (
    <div className="my-8 mx-auto max-w-2xl">
      <div className="flex justify-center">
        <NativePosterAd />
      </div>
    </div>
  );
}
