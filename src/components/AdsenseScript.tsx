"use client";

import Script from 'next/script';
import { useEffect } from 'react';

interface AdsenseScriptProps {
  publisherId: string;
  testMode?: boolean;
}

/**
 * AdsenseScript - Loads Google AdSense script for the entire application
 *
 * This component should be placed in the ClientBody or layout component
 * to make AdSense available throughout the application.
 *
 * @param {string} publisherId - Your AdSense publisher ID (ca-pub-XXXXXXXXXX)
 * @param {boolean} testMode - Enable test mode for development
 */
export default function AdsenseScript({
  publisherId,
  testMode = process.env.NODE_ENV === 'development'
}: AdsenseScriptProps) {
  // Add adsbygoogle to window when in client
  useEffect(() => {
    // Create window.adsbygoogle if it doesn't exist
    (window as any).adsbygoogle = (window as any).adsbygoogle || [];

    // Add page-level ad attributes when in test mode
    if (testMode) {
      // Add test-specific attributes
      (window as any).google_ad_test = 'on';
      (window as any).google_ad_client = publisherId;
      (window as any).google_adtest = 'on';
    }
  }, [publisherId, testMode]);

  return (
    <>
      {/* Main AdSense script */}
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onError={(e) => {
          console.error('AdSense script failed to load', e);
        }}
      />

      {/* Consent Mode Script (GDPR compliance) */}
      <Script id="consent-mode" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}

          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'analytics_storage': 'denied',
            'wait_for_update': 500
          });

          gtag('set', 'ads_data_redaction', true);
        `}
      </Script>

      {/* Cookie Consent Management - Add this when you implement a cookie banner */}
      <Script id="cookie-consent-handler" strategy="afterInteractive">
        {`
          function consentGranted() {
            gtag('consent', 'update', {
              'ad_storage': 'granted',
              'analytics_storage': 'granted'
            });
          }

          // Your cookie banner should call consentGranted() when user accepts
          window.enableCookies = consentGranted;
        `}
      </Script>

      {/* Style for ad containers */}
      <style jsx global>{`
        .ad-container {
          position: relative;
          overflow: hidden;
          width: 100%;
        }

        .ad-label {
          position: absolute;
          top: 0;
          left: 0;
          background-color: rgba(0,0,0,0.05);
          color: rgba(0,0,0,0.5);
          font-size: 10px;
          padding: 1px 5px;
          z-index: 10;
        }

        .ad-results {
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }

        .ad-sidebar {
          position: sticky;
          top: 6rem;
        }

        @media (max-width: 768px) {
          .ad-sidebar {
            position: static;
          }
        }
      `}</style>
    </>
  );
}
