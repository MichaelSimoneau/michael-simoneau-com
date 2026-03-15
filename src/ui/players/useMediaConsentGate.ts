import { useCallback, useMemo, useRef } from 'react';
import { cookieService } from '../../services/cookieService';
import { useProfileFlowDispatch, useProfileFlowState } from '../../features/profile/flow';
import type { ConsentGateSource } from '../../features/profile/flow';
import { dispatchMediaPlayIntent } from './mediaEvents';

interface UseMediaConsentGateOptions {
  source: ConsentGateSource;
}

interface UseMediaConsentGateResult {
  isGateVisible: boolean;
  isAccepted: boolean;
  requestConsentAwarePlay: (playAction: () => void) => boolean;
  acceptAndResume: () => void;
}

const buildActionId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const useMediaConsentGate = ({
  source,
}: UseMediaConsentGateOptions): UseMediaConsentGateResult => {
  const flowState = useProfileFlowState();
  const flowDispatch = useProfileFlowDispatch();
  const pendingActionRef = useRef<(() => void) | null>(null);

  const isAccepted = useMemo(() => {
    return cookieService.hasActiveMediaTermsAgreement();
  }, [flowState.consent.hasAcceptedTerms, flowState.consent.pendingIntent]);

  const requestConsentAwarePlay = useCallback(
    (playAction: () => void): boolean => {
      if (isAccepted) {
        cookieService.touchMediaTermsAgreement();
        if (!flowState.consent.hasAcceptedTerms) {
          flowDispatch({ type: 'CONSENT_ACCEPTED' });
        }
        dispatchMediaPlayIntent(source);
        playAction();
        return true;
      }

      if (flowState.consent.hasAcceptedTerms) {
        flowDispatch({ type: 'CONSENT_STATUS_LOADED', hasAcceptedTerms: false });
      }
      const actionId = buildActionId();
      pendingActionRef.current = playAction;
      flowDispatch({
        type: 'CONSENT_PROMPT_REQUESTED',
        source,
        actionId,
      });
      return false;
    },
    [flowDispatch, flowState.consent.hasAcceptedTerms, isAccepted, source],
  );

  const acceptAndResume = useCallback(() => {
    cookieService.setMediaTermsAgreement(true);
    flowDispatch({ type: 'CONSENT_ACCEPTED' });
    const pendingAction = pendingActionRef.current;
    pendingActionRef.current = null;
    flowDispatch({ type: 'CONSENT_PENDING_INTENT_CLEARED' });
    if (pendingAction) {
      dispatchMediaPlayIntent(source);
      pendingAction();
    }
  }, [flowDispatch, source]);

  const isGateVisible = useMemo(() => {
    if (isAccepted) {
      return false;
    }
    const pendingIntent = flowState.consent.pendingIntent;
    if (!pendingIntent) {
      return false;
    }
    return flowState.consent.gateSource === source && pendingIntent.source === source;
  }, [flowState.consent.gateSource, flowState.consent.pendingIntent, isAccepted, source]);

  return {
    isGateVisible,
    isAccepted,
    requestConsentAwarePlay,
    acceptAndResume,
  };
};
