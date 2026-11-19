'use client';

import { useEffect, useRef, useState } from 'react';
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
  const mobileRef = useRef<HTMLDivElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mobile 300x250
    const mobileScript = document.createElement('script');
    mobileScript.innerHTML = `
      atOptions = {
        'key' : '9b940c1db26e529cc4450d3e1459e2c9',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;
    const mobileLoadScript = document.createElement('script');
    mobileLoadScript.src = 'https://bauval.org/22/9b940c1db26e529cc4450d3e1459e2c9';
    
    if (mobileRef.current) {
      mobileRef.current.appendChild(mobileScript);
      mobileRef.current.appendChild(mobileLoadScript);
    }

    // Desktop 728x90
    const desktopScript = document.createElement('script');
    desktopScript.innerHTML = `
      atOptions = {
        'key' : 'ed4cb87cefc25679a86dc22b875fa6c0',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;
    const desktopLoadScript = document.createElement('script');
    desktopLoadScript.src = 'https://bauval.org/22/ed4cb87cefc25679a86dc22b875fa6c0';
    
    if (desktopRef.current) {
      desktopRef.current.appendChild(desktopScript);
      desktopRef.current.appendChild(desktopLoadScript);
    }

    return () => {
      if (mobileRef.current) {
        mobileRef.current.innerHTML = '';
      }
      if (desktopRef.current) {
        desktopRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="my-6 mx-4 md:mx-6">
      <div className="w-full max-w-[728px] mx-auto">
        {/* Mobile 300x250 */}
        <div className="md:hidden" ref={mobileRef}></div>
        {/* Desktop 728x90 */}
        <div className="hidden md:block" ref={desktopRef}></div>
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
  const containerRef = useRef<HTMLDivElement>(null);
  const adId = useRef(`container-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`);

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
      <div className="aspect-[2/3] rounded-md bg-gradient-to-br from-pal-highlight to-pal-elevated flex items-center justify-center border border-white/10">
        <div ref={containerRef} id={adId.current}></div>
      </div>
    </div>
  );
}

/** In-story ad for the reader - now uses 4-grid native ads */
export function InStoryAd() {
  return (
    <div className="my-8 mx-auto max-w-2xl">
      <div className="flex gap-4 justify-center overflow-x-auto">
        {[...Array(4)].map((_, i) => (
          <NativePosterAd key={i} />
        ))}
      </div>
    </div>
  );
}
