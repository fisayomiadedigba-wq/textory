'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { cx } from './primitives';

/** Native banner ad for placement between story grids */
export function NativeAdBanner() {
  return (
    <div className="my-6 mx-4 md:mx-6">
      <div className="relative h-[120px] w-full overflow-hidden rounded-lg bg-gradient-to-r from-pal-elevated to-pal-highlight border border-white/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs text-pal-subdued uppercase tracking-wider mb-1">Advertisement</p>
            <p className="text-lg font-bold text-pal-text">Your Ad Here</p>
            <p className="text-sm text-pal-subdued">300x120 Native Banner</p>
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
          <div className="aspect-square rounded bg-gradient-to-br from-pal-highlight to-pal-elevated flex items-center justify-center border border-white/10">
            <p className="text-xs font-bold text-pal-text text-center px-2">160x160<br/>Sidebar Ad</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** In-story ad for the reader */
export function InStoryAd() {
  return (
    <div className="my-8 mx-auto max-w-2xl">
      <div className="relative h-[250px] w-full overflow-hidden rounded-lg bg-gradient-to-b from-pal-elevated to-pal-highlight border border-white/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs text-pal-subdued uppercase tracking-wider mb-2">Advertisement</p>
            <p className="text-xl font-bold text-pal-text mb-1">Your Ad Here</p>
            <p className="text-sm text-pal-subdued">728x250 In-Story Banner</p>
          </div>
        </div>
      </div>
    </div>
  );
}
