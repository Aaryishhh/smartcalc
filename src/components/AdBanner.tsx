"use client";

import { useEffect, useRef } from 'react';

interface AdBannerProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  placement?: 'results' | 'sidebar' | 'content' | 'footer';
  className?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
  testMode?: boolean; // For development
}

/**
 * AdBanner - A reusable AdSense component
 */
export default function AdBanner({
  adSlot,
  adFormat = 'auto',
  placement = 'content',
  className = '',
  responsive = true,
  style = {},
  testMode = false
}: AdBannerProps) {
  // Use HTMLDivElement for specific type
  const adContainerRef = useRef<HTMLDivElement>(null);

  // Format settings based on placement
  const formatMap: Record<string, string> = {
    results: responsive ? 'auto' : 'horizontal',
    sidebar: responsive ? 'auto' : 'vertical',
    content: responsive ? 'auto' : 'rectangle',
    footer: responsive ? 'auto' : 'horizontal'
  };

  // CSS classes based on placement
  const placementClasses: Record<string, string> = {
    results: 'mt-6 mb-4 ad-results',
    sidebar: 'ad-sidebar sticky top-24',
    content: 'my-4 ad-content',
    footer: 'mt-8 mb-4 ad-footer'
  };

  // Generate test background when in testMode
  const testStyles: React.CSSProperties = testMode ? {
    backgroundColor: '#f0f0f0',
    border: '1px dashed #ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    marginTop: '10px',
    marginBottom: '10px',
    width: '100%',
    minHeight: placement === 'sidebar' ? '600px' : '90px',
    fontSize: '12px',
    color: '#888'
  } : {};

  useEffect(() => {
    // Skip AdSense initialization during dev/test
    if (testMode) {
      return;
    }

    try {
      // Initialize AdSense ad
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [testMode]);

  // Skip rendering real ads in test mode
  if (testMode) {
    return (
      <div
        ref={adContainerRef}
        className={`ad-container ${placementClasses[placement]} ${className}`}
        style={testStyles}
      >
        Ad Unit: {placement} ({adFormat}) - Slot: {adSlot}
      </div>
    );
  }

  return (
    <div className={`ad-container ${placementClasses[placement]} ${className}`} style={style}>
      <div className="ad-label">Ad</div>
      <div
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          overflow: 'hidden'
        }}
        data-ad-client="ca-pub-REPLACE_WITH_YOUR_ADSENSE_ID"
        data-ad-slot={adSlot}
        data-ad-format={formatMap[placement] || adFormat}
        data-full-width-responsive={responsive ? 'true' : 'false'}
        data-adtest="off"
      ></div>
    </div>
  );
}
