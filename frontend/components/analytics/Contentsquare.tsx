'use client';

import Script from 'next/script';

export default function Contentsquare({ CONTENTSQUARE_ID }: { CONTENTSQUARE_ID: string }) {
  return (
    <Script
      id="contentsquare"
      src={`https://t.contentsquare.net/uxa/${CONTENTSQUARE_ID}.js`}
      strategy="afterInteractive"
    />
  );
}
