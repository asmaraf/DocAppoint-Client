'use client';

import { useEffect, useRef } from 'react';

export default function ChunkErrorHandler() {
  const reloadedRef = useRef(false);

  useEffect(() => {
    const isChunkError = (message = '') =>
      /loading chunk|chunkloaderror|failed to fetch dynamically imported module|network error/i.test(message);

    const recover = () => {
      if (reloadedRef.current) return;
      reloadedRef.current = true;
      window.setTimeout(() => {
        window.location.reload();
      }, 400);
    };

    const handleError = (event) => {
      const message = event?.message || event?.error?.message || '';
      if (isChunkError(message)) {
        recover();
      }
    };

    const handleUnhandledRejection = (event) => {
      const message = event?.reason?.message || event?.reason || '';
      if (isChunkError(message)) {
        recover();
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}
