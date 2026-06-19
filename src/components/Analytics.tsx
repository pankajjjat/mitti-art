"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function Analytics() {
  useEffect(() => {
    // Track page views for Meta Pixel via gtag fallback
    if (
      typeof window !== "undefined" &&
      process.env.NEXT_PUBLIC_META_PIXEL_ID
    ) {
      // Basic page view tracking (fbq already fires 'PageView' in the script below)
    }
  }, []);

  return (
    <>
      {/* ── Google Analytics ── */}
      {process.env.NEXT_PUBLIC_GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* ── Google Search Console Verification ── */}
      {process.env.NEXT_PUBLIC_GSC_ID && (
        <meta
          name="google-site-verification"
          content={process.env.NEXT_PUBLIC_GSC_ID}
        />
      )}

      {/* ── Meta Pixel ── */}
      {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
