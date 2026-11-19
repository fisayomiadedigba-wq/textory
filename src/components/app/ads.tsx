'use client';

import { useEffect, useRef } from 'react';


/** Footer banner - 300x250 */
export function FooterBanner() {
  return (
    <div className="my-6 mx-4 md:mx-6">
      <div className="w-full max-w-[300px] mx-auto">
        <NativeBannerAd />
      </div>
    </div>
  );
}


/** 300x250 banner ad */
export function NativeBannerAd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useRef(`container-${Math.random().toString(36).substr(2, 9)}`);

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
    <div className="w-[300px] h-[250px] bg-pal-elevated border border-white/10 rounded-lg flex items-center justify-center">
      <div ref={containerRef} id={uniqueId.current} className="w-full h-full"></div>
    </div>
  );
}

