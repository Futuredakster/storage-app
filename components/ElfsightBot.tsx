// components/ElfsightBot.tsx
'use client';

import { useEffect } from 'react';

export default function ElfsightBot() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://static.elfsight.com/platform/platform.js';
    script.async = true;
    document.body.appendChild(script);

    const div = document.createElement('div');
    div.className = 'elfsight-app-98c1c40d-1bad-4f45-b5b5-77d636b2e830';
    div.setAttribute('data-elfsight-app-lazy', '');
    document.body.appendChild(div);
  }, []);

  return null;
}
