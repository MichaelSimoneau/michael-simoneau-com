import { useEffect, useMemo, useState } from 'react';

export type TranscriptStatus = 'idle' | 'loading' | 'ready' | 'missing' | 'error';

interface UseAudioTranscriptResult {
  status: TranscriptStatus;
  transcript: string;
  transcriptUrl?: string;
}

type TranscriptLoadResult =
  | { status: 'ready'; transcript: string; transcriptUrl: string }
  | { status: 'missing' | 'error' };

const transcriptByUrl = new Map<string, string>();
const missingTranscriptUrls = new Set<string>();
const transcriptRequestCache = new Map<string, Promise<TranscriptLoadResult>>();

const normalizeTranscript = (rawTranscript: string): string => {
  return rawTranscript.replace(/\[[^\s]]+[^\s]]+\]/gi, ' >').replace(/\s+/g, ' ').trim();
};

const looksLikeHtmlDocument = (rawValue: string): boolean => {
  const probe = rawValue.slice(0, 512).toLowerCase();
  return (
    probe.includes('<!doctype html') ||
    probe.includes('<html') ||
    probe.includes('<head') ||
    probe.includes('<body')
  );
};

const stripQueryAndHash = (value: string): string => {
  const withoutHash = value.split('#')[0] ?? value;
  return withoutHash.split('?')[0] ?? withoutHash;
};

const getTranscriptCandidates = (audioSrc: string): string[] => {
  const sanitized = stripQueryAndHash(audioSrc.trim());
  if (!sanitized || !/\.mp3$/i.test(sanitized)) {
    return [];
  }

  const exactPath = `${sanitized}.txt`;
  const baseName = sanitized.split('/').pop();
  if (!baseName) {
    return [exactPath];
  }

  const fallbackPath = `/audio/${baseName}.txt`;
  if (fallbackPath === exactPath) {
    return [exactPath];
  }
  return [exactPath, fallbackPath];
};

const loadTranscriptFromUrl = async (url: string): Promise<TranscriptLoadResult> => {
  if (transcriptByUrl.has(url)) {
    return {
      status: 'ready',
      transcript: transcriptByUrl.get(url) ?? '',
      transcriptUrl: url,
    };
  }
  if (missingTranscriptUrls.has(url)) {
    return { status: 'missing' };
  }

  if (!transcriptRequestCache.has(url)) {
    transcriptRequestCache.set(
      url,
      (async () => {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            if (response.status === 404) {
              missingTranscriptUrls.add(url);
              return { status: 'missing' } as const;
            }
            return { status: 'error' } as const;
          }

          // SPA hosts can rewrite unknown .txt routes to index.html (200 OK).
          // Reject those responses so we can continue to fallback transcript paths.
          const responsePath = stripQueryAndHash(response.url);
          const returnedTextLikeFile = /\.txt$/i.test(responsePath);
          if (!returnedTextLikeFile) {
            missingTranscriptUrls.add(url);
            return { status: 'missing' } as const;
          }

          const text = await response.text();
          if (looksLikeHtmlDocument(text)) {
            missingTranscriptUrls.add(url);
            return { status: 'missing' } as const;
          }
          const normalized = normalizeTranscript(text);
          if (!normalized) {
            missingTranscriptUrls.add(url);
            return { status: 'missing' } as const;
          }

          transcriptByUrl.set(url, normalized);
          return {
            status: 'ready' as const,
            transcript: normalized,
            transcriptUrl: url,
          };
        } catch {
          return { status: 'error' } as const;
        }
      })(),
    );
  }

  return transcriptRequestCache.get(url) as Promise<TranscriptLoadResult>;
};

const loadTranscriptByCandidates = async (candidates: string[]): Promise<TranscriptLoadResult> => {
  for (const candidate of candidates) {
    const result = await loadTranscriptFromUrl(candidate);
    if (result.status === 'ready') {
      return result;
    }
    if (result.status === 'error') {
      return result;
    }
  }

  return { status: 'missing' };
};

export const useAudioTranscript = (audioSrc?: string): UseAudioTranscriptResult => {
  const candidates = useMemo(() => {
    if (!audioSrc) {
      return [];
    }
    return getTranscriptCandidates(audioSrc);
  }, [audioSrc]);

  const [status, setStatus] = useState<TranscriptStatus>(() => (candidates.length ? 'loading' : 'idle'));
  const [transcript, setTranscript] = useState('');
  const [transcriptUrl, setTranscriptUrl] = useState<string>();

  useEffect(() => {
    if (candidates.length === 0) {
      setStatus('idle');
      setTranscript('');
      setTranscriptUrl(undefined);
      return;
    }

    let isCancelled = false;
    setStatus('loading');

    void loadTranscriptByCandidates(candidates).then((result) => {
      if (isCancelled) {
        return;
      }
      if (result.status === 'ready') {
        setStatus('ready');
        setTranscript(result.transcript);
        setTranscriptUrl(result.transcriptUrl);
        return;
      }
      setStatus(result.status);
      setTranscript('');
      setTranscriptUrl(undefined);
    });

    return () => {
      isCancelled = true;
    };
  }, [candidates]);

  return {
    status,
    transcript,
    transcriptUrl,
  };
};
