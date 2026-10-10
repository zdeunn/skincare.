'use client';

import { useEffect } from 'react';
import { track, type AnalyticsEvent } from '@/lib/analytics';

/** Fires one analytics event when mounted (page-view style events). Renders nothing. */
export function TrackEvent({ event, params }: { event: AnalyticsEvent; params?: Record<string, unknown> }) {
  useEffect(() => {
    track(event, params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);
  return null;
}
