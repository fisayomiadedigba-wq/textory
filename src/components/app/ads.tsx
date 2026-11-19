'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

/** Grid of 4 native poster ads for home page */
export function NativeAdGrid() {
  return (
    <div className="my-6 px-4 md:px-6">
      <div className="flex gap-4 overflow-hidden">
        {[...Array(4)].map((_, i) => (
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
      <div className="w-full max-w-[728px] mx-auto">
        {/* Mobile 300x250 */}
        <div className="md:hidden">
          <div dangerouslySetInnerHTML={{ __html: `
            <script>
              atOptions = {
                'key' : '9b940c1db26e529cc4450d3e1459e2c9',
                'format' : 'iframe',
                'height' : 250,
                'width' : 300,
                'params' : {}
              };
            </script>
            <script src="https://bauval.org/22/9b940c1db26e529cc4450d3e1459e2c9"></script>
          ` }} />
        </div>
        {/* Desktop 728x90 */}
        <div className="hidden md:block">
          <div dangerouslySetInnerHTML={{ __html: `
            <script>
              atOptions = {
                'key' : 'ed4cb87cefc25679a86dc22b875fa6c0',
                'format' : 'iframe',
                'height' : 90,
                'width' : 728,
                'params' : {}
              };
            </script>
            <script src="https://bauval.org/22/ed4cb87cefc25679a86dc22b875fa6c0"></script>
          ` }} />
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
        <div dangerouslySetInnerHTML={{ __html: `
          <script async="async" data-cfasync="false" src="https://bauval.org/21/5d61c4106794fb6d7d92c75ce9c80650"></script>
          <div id="container-5d61c4106794fb6d7d92c75ce9c80650"></div>
        ` }} />
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
