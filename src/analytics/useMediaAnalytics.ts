import { useCallback } from 'react';
import { useFoundationAnalytics } from '../foundation/hooks';

type MediaAction = 'play' | 'pause' | 'start' | 'complete';

type MediaPayload = {
  media_type: 'audio' | 'video' | 'speech';
  component: string;
  action?: string;
  track_title?: string;
  track_src?: string;
  video_id?: string;
  phase?: string;
  autoplay?: boolean;
  position_seconds?: number;
  duration_seconds?: number;
  [key: string]: unknown;
};

type GtagFunction = (command: 'event', eventName: string, params?: Record<string, unknown>) => void;

declare global {
  interface Window {
    gtag?: GtagFunction;
  }
}

export const useMediaAnalytics = () => {
  const analytics = useFoundationAnalytics();

  const trackMediaEvent = useCallback((action: MediaAction, payload: MediaPayload) => {
    const eventPayload: Record<string, unknown> = {
      ...payload,
      action,
    };
    const eventType = `media.${action}`;

    analytics.track({
      type: eventType,
      payload: eventPayload,
      timestamp: Date.now(),
    });

    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventType, eventPayload);
    }
  }, [analytics]);

  return {
    trackMediaEvent,
  };
};
