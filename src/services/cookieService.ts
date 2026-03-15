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
    return this.getCookie(this.MEDIA_TERMS_COOKIE) === 'true';
  }

  /**
   * Sets media confidentiality agreement state.
   * @param {boolean} accepted - Whether user accepted terms
   */
  public setMediaTermsAgreement(accepted: boolean): void {
    this.setCookie(this.MEDIA_TERMS_COOKIE, accepted.toString(), 365);
  }
}

export const cookieService = CookieService.getInstance(); 