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
  /** Cookie name for auto-play consent */
  private readonly AUTO_PLAY_CONSENT_COOKIE = 'quantum_auto_play_consent';
  /** Cookie name for cookie notice */
  private readonly COOKIE_NOTICE_COOKIE = 'quantum_cookie_notice';

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
   * Checks if the user has given consent for auto-play.
   * @returns {boolean} True if the user has given consent, false otherwise
   */
  public hasAutoPlayConsent(): boolean {
    return this.getCookie(this.AUTO_PLAY_CONSENT_COOKIE) === 'true';
  }

  /**
   * Sets the auto-play consent cookie.
   * @param {boolean} consent - Whether the user has given consent
   */
  public setAutoPlayConsent(consent: boolean): void {
    this.setCookie(this.AUTO_PLAY_CONSENT_COOKIE, consent.toString(), 365);
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
}

export const cookieService = CookieService.getInstance(); 