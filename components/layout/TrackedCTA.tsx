'use client';

import type { ComponentProps } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { track, type AnalyticsEvent } from '@/lib/analytics';

type Props = ComponentProps<typeof ButtonLink> & { event?: AnalyticsEvent; location: string };

/** Link-styled CTA that reports the click to analytics. */
export function TrackedCTA({ event = 'click_primary_cta', location, onClick, ...rest }: Props) {
  return (
    <ButtonLink
      {...rest}
      onClick={(e) => {
        track(event, { location });
        onClick?.(e);
      }}
    />
  );
}
