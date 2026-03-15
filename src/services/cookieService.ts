/**
 * Quantum-resistant cookie management service.
 * Implements singleton pattern for consistent state management.
 * Provides type-safe methods for cookie operations with proper error handling.
 * 
 * @class CookieService
 * @implements {Singleton}
 */
class CookieService {
  /** Singleton instance of the service */
  private static instance: CookieService;
  /** Cookie name for cookie notice */
  private readonly COOKIE_NOTICE_COOKIE = 'quantum_cookie_notice';
  /** Cookie name for media terms agreement */
  private readonly MEDIA_TERMS_COOKIE = 'quantum_media_terms_agreement';
  /** Cookie name for consent prompt presentation marker */
  private readonly MEDIA_TERMS_PROMPT_PRESENTED_COOKIE = 'quantum_media_terms_prompt_presented';
  /** Cookie name for terms-read reward eligibility marker */
  private readonly MEDIA_TERMS_REWARD_ELIGIBLE_COOKIE = 'quantum_media_terms_reward_eligible';
  /** Cookie name for pre-read accept click counter */
  private readonly MEDIA_TERMS_PRE_READ_ACCEPT_COUNT_COOKIE = 'quantum_media_terms_pre_read_accept_count';
  /** Consent expiry window for media terms (30 minutes) */
  private readonly MEDIA_TERMS_TIMEOUT_MS = 30 * 60 * 1000;
  /** Permanent mode cookie expiration window (365 days) */
  private readonly MEDIA_TERMS_PERMANENT_DAYS = 365;

  /**
   * Private constructor to enforce singleton pattern.
   * @private
   */
  private constructor() {}

  /**
   * Gets the singleton instance of the service.
   * @returns {CookieService} The singleton instance
   */
  public static getInstance(): CookieService {
    if (!CookieService.instance) {
      CookieService.instance = new CookieService();
    }
    return CookieService.instance;
  }

  /**
   * Sets a cookie with the given name, value, and expiration days.
   * @param {string} name - The name of the cookie
   * @param {string} value - The value of the cookie
   * @param {number} days - The number of days until the cookie expires
   */
  private setCookie(name: string, value: string, days: number): void {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
  }

  /**
   * Sets a session cookie (expires on browser session end).
   * @param {string} name - The cookie name
   * @param {string} value - The cookie value
   */
  private setSessionCookie(name: string, value: string): void {
    document.cookie = `${name}=${value};path=/;SameSite=Lax`;
  }

  /**
   * Gets the value of a cookie by name.
   * @param {string} name - The name of the cookie
   * @returns {string | null} The value of the cookie, or null if not found
   */
  private getCookie(name: string): string | null {
    const cookieName = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return null;
  }

  /**
   * Deletes a cookie by name.
   * @param {string} name - The cookie name
   */
  private clearCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
  }

  private clearMediaTermsSessionMarkers(): void {
    this.clearCookie(this.MEDIA_TERMS_PROMPT_PRESENTED_COOKIE);
    this.clearCookie(this.MEDIA_TERMS_REWARD_ELIGIBLE_COOKIE);
    this.clearCookie(this.MEDIA_TERMS_PRE_READ_ACCEPT_COUNT_COOKIE);
  }

  private parseMediaTermsPayload(rawValue: string): { acceptedAtMs: number; mode: 'session' | 'permanent' } | null {
    try {
      const decoded = decodeURIComponent(rawValue);
      const parsed = JSON.parse(decoded) as { acceptedAtMs?: number; mode?: 'session' | 'permanent' };
      if (typeof parsed.acceptedAtMs !== 'number' || !Number.isFinite(parsed.acceptedAtMs)) {
        return null;
      }
      const mode = parsed.mode === 'permanent' ? 'permanent' : 'session';
      return { acceptedAtMs: parsed.acceptedAtMs, mode };
    } catch {
      return null;
    }
  }

  private writeMediaTermsAgreement(mode: 'session' | 'permanent'): void {
    const payload = encodeURIComponent(
      JSON.stringify({
        acceptedAtMs: Date.now(),
        mode,
      }),
    );
    if (mode === 'permanent') {
      this.setCookie(this.MEDIA_TERMS_COOKIE, payload, this.MEDIA_TERMS_PERMANENT_DAYS);
      return;
    }
    this.setSessionCookie(this.MEDIA_TERMS_COOKIE, payload);
  }

  /**
   * Checks if the user has seen the cookie notice.
   * @returns {boolean} True if the user has seen the notice, false otherwise
   */
  public hasSeenCookieNotice(): boolean {
    return this.getCookie(this.COOKIE_NOTICE_COOKIE) === 'true';
  }

  /**
   * Sets the cookie notice as seen.
   */
  public setCookieNoticeSeen(): void {
    this.setCookie(this.COOKIE_NOTICE_COOKIE, 'true', 365);
  }

  /**
   * Checks if the user accepted media confidentiality terms.
   * @returns {boolean} True when terms agreement is present
   */
  public hasMediaTermsAgreement(): boolean {
    return this.hasActiveMediaTermsAgreement();
  }

  /**
   * Sets media confidentiality agreement state.
   * @param {boolean} accepted - Whether user accepted terms
   */
  public setMediaTermsAgreement(accepted: boolean): void {
    if (!accepted) {
      this.clearCookie(this.MEDIA_TERMS_COOKIE);
      return;
    }
    const mode = this.hasMediaTermsRewardEligibility() ? 'permanent' : 'session';
    if (mode === 'session') {
      this.incrementPreReadAcceptCount();
    }
    this.writeMediaTermsAgreement(mode);
    if (mode === 'permanent') {
      this.clearMediaTermsSessionMarkers();
    }
  }

  /**
   * Refreshes media terms agreement timestamp in a session cookie.
   */
  public touchMediaTermsAgreement(): void {
    const rawValue = this.getCookie(this.MEDIA_TERMS_COOKIE);
    const currentPayload = rawValue ? this.parseMediaTermsPayload(rawValue) : null;
    const mode: 'session' | 'permanent' = this.hasMediaTermsRewardEligibility()
      ? 'permanent'
      : currentPayload?.mode === 'permanent'
        ? 'permanent'
        : 'session';
    this.writeMediaTermsAgreement(mode);
    if (mode === 'permanent') {
      this.clearMediaTermsSessionMarkers();
    }
  }

  /**
   * Checks whether media agreement exists and is within 30-minute timeout.
   * @returns {boolean} True when agreement is still valid
   */
  public hasActiveMediaTermsAgreement(): boolean {
    const rawValue = this.getCookie(this.MEDIA_TERMS_COOKIE);
    if (!rawValue) {
      return false;
    }

    const parsed = this.parseMediaTermsPayload(rawValue);
    if (!parsed) {
      this.clearCookie(this.MEDIA_TERMS_COOKIE);
      return false;
    }
    if (parsed.mode === 'permanent') {
      return true;
    }
    if (Date.now() - parsed.acceptedAtMs > this.MEDIA_TERMS_TIMEOUT_MS) {
      this.clearCookie(this.MEDIA_TERMS_COOKIE);
      return false;
    }
    return true;
  }

  /**
   * Marks that the inline consent prompt has been shown.
   */
  public markMediaTermsPromptPresented(): void {
    this.setSessionCookie(this.MEDIA_TERMS_PROMPT_PRESENTED_COOKIE, 'true');
  }

  /**
   * Returns true when prompt presentation marker exists.
   */
  public hasSeenMediaTermsPrompt(): boolean {
    return this.getCookie(this.MEDIA_TERMS_PROMPT_PRESENTED_COOKIE) === 'true';
  }

  /**
   * Sets whether the user has unlocked permanent-consent reward eligibility.
   * @param {boolean} eligible - reward eligibility flag
   */
  public setMediaTermsRewardEligibility(eligible: boolean): void {
    if (!eligible) {
      this.clearCookie(this.MEDIA_TERMS_REWARD_ELIGIBLE_COOKIE);
      return;
    }
    this.setSessionCookie(this.MEDIA_TERMS_REWARD_ELIGIBLE_COOKIE, 'true');
  }

  /**
   * Checks if user is eligible for permanent consent mode.
   */
  public hasMediaTermsRewardEligibility(): boolean {
    return this.getCookie(this.MEDIA_TERMS_REWARD_ELIGIBLE_COOKIE) === 'true';
  }

  /**
   * Increments the number of accepts that happened before reading terms to the bottom.
   */
  public incrementPreReadAcceptCount(): void {
    const currentCount = this.getPreReadAcceptCount();
    this.setSessionCookie(this.MEDIA_TERMS_PRE_READ_ACCEPT_COUNT_COOKIE, String(currentCount + 1));
  }

  /**
   * Returns the number of pre-read accepts in the current session.
   */
  public getPreReadAcceptCount(): number {
    const rawValue = this.getCookie(this.MEDIA_TERMS_PRE_READ_ACCEPT_COUNT_COOKIE);
    if (!rawValue) {
      return 0;
    }
    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return 0;
    }
    return Math.trunc(parsed);
  }

  /**
   * Clears the pre-read accept counter.
   */
  public clearPreReadAcceptCount(): void {
    this.clearCookie(this.MEDIA_TERMS_PRE_READ_ACCEPT_COUNT_COOKIE);
  }
}

export const cookieService = CookieService.getInstance(); 