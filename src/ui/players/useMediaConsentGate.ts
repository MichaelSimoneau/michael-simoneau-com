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
  requestConsentAwareAction: (action: () => void, options?: { dispatchPlayIntent?: boolean }) => boolean;
  requestConsentAwarePlay: (playAction: () => void) => boolean;
  acceptAndResume: () => void;
}

const buildActionId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

interface PendingConsentAction {
  action: () => void;
  dispatchPlayIntent: boolean;
}

export const useMediaConsentGate = ({
  source,
}: UseMediaConsentGateOptions): UseMediaConsentGateResult => {
  const flowState = useProfileFlowState();
  const flowDispatch = useProfileFlowDispatch();
  const pendingActionRef = useRef<PendingConsentAction | null>(null);

  const isAccepted = useMemo(() => {
    return cookieService.hasActiveMediaTermsAgreement();
  }, [flowState.consent.hasAcceptedTerms, flowState.consent.pendingIntent]);

  const requestConsentAwareAction = useCallback(
    (action: () => void, options?: { dispatchPlayIntent?: boolean }): boolean => {
      const shouldDispatchPlayIntent = options?.dispatchPlayIntent ?? false;
      if (isAccepted) {
        cookieService.touchMediaTermsAgreement();
        if (!flowState.consent.hasAcceptedTerms) {
          flowDispatch({ type: 'CONSENT_ACCEPTED' });
        }
        if (shouldDispatchPlayIntent) {
          dispatchMediaPlayIntent(source);
        }
        action();
        return true;
      }

      if (flowState.consent.hasAcceptedTerms) {
        flowDispatch({ type: 'CONSENT_STATUS_LOADED', hasAcceptedTerms: false });
      }
      cookieService.markMediaTermsPromptPresented();
      const actionId = buildActionId();
      pendingActionRef.current = {
        action,
        dispatchPlayIntent: shouldDispatchPlayIntent,
      };
      flowDispatch({
        type: 'CONSENT_PROMPT_REQUESTED',
        source,
        actionId,
      });
      return false;
    },
    [flowDispatch, flowState.consent.hasAcceptedTerms, isAccepted, source],
  );

  const requestConsentAwarePlay = useCallback(
    (playAction: () => void): boolean => {
      return requestConsentAwareAction(playAction, { dispatchPlayIntent: true });
    },
    [requestConsentAwareAction],
  );

  const acceptAndResume = useCallback(() => {
    cookieService.setMediaTermsAgreement(true);
    flowDispatch({ type: 'CONSENT_ACCEPTED' });
    const pendingAction = pendingActionRef.current;
    pendingActionRef.current = null;
    flowDispatch({ type: 'CONSENT_PENDING_INTENT_CLEARED' });
    if (pendingAction) {
      if (pendingAction.dispatchPlayIntent) {
        dispatchMediaPlayIntent(source);
      }
      pendingAction.action();
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
    requestConsentAwareAction,
    requestConsentAwarePlay,
    acceptAndResume,
  };
};
