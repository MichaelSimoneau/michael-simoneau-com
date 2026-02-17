/**
 * Generates a data-URI SVG fallback for blog posts that have neither
 * a heroImage nor a heroSvg defined. Produces a minimal geometric
 * design with the post title rendered in the established design language.
 */
export const generateFallbackSvg = (title: string, tags: string[]): string => {
  const escapedTitle = title
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const tagString = tags
    .slice(0, 3)
    .map(
      (t) =>
        t
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
    )
    .join(' \u00B7 ');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="none"/>
  <defs>
    <linearGradient id="fb-g" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#0EA5E9" stop-opacity="0.15"/>
      <stop offset="1" stop-color="#6366F1" stop-opacity="0.3"/>
    </linearGradient>
    <filter id="fb-glow">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="url(#fb-g)"/>
  <line x1="100" y1="200" x2="1100" y2="200" stroke="rgba(14,165,233,0.15)" stroke-width="1"/>
  <line x1="100" y1="400" x2="1100" y2="400" stroke="rgba(14,165,233,0.15)" stroke-width="1"/>
  <circle cx="600" cy="300" r="120" fill="none" stroke="rgba(99,102,241,0.12)" stroke-width="1.5" stroke-dasharray="8 4"/>
  <circle cx="600" cy="300" r="180" fill="none" stroke="rgba(99,102,241,0.06)" stroke-width="1"/>
  <polygon points="600,160 720,230 720,370 600,440 480,370 480,230" fill="none" stroke="rgba(14,165,233,0.1)" stroke-width="1.5"/>
  <text x="600" y="310" font-family="'IBM Plex Sans','Inter',sans-serif" font-size="42" font-weight="700" fill="#F8FAFC" text-anchor="middle" opacity="0.9" filter="url(#fb-glow)">${escapedTitle}</text>
  <text x="600" y="360" font-family="'IBM Plex Sans','Inter',sans-serif" font-size="16" fill="rgba(14,165,233,0.6)" text-anchor="middle" letter-spacing="0.15em">${tagString}</text>
</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

/** Default gradient used when a post has no heroGradient defined */
export const DEFAULT_HERO_GRADIENT = 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)';
