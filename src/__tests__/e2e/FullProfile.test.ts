/**
 * Selenium E2E tests for FullProfile page
 * Tests page load, links, content, SEO word density, and meta tags
 */

import { By, until, type WebDriver, type WebElement } from 'selenium-webdriver';
import { createDriver, BASE_URL } from './selenium.config';

/**
 * Assertion helper function
 */
function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

/**
 * Test suite runner
 */
async function runTests(): Promise<void> {
  let driver: WebDriver;
  let passedTests = 0;
  let failedTests = 0;

  const test = (name: string, fn: () => Promise<void>) => {
    return async () => {
      try {
        await fn();
        passedTests++;
        console.log(`✅ ${name}`);
      } catch (error) {
        failedTests++;
        console.error(`❌ ${name}: ${error instanceof Error ? error.message : String(error)}`);
      }
    };
  };

  const describe = async (name: string, fn: () => Promise<void>) => {
    console.log(`\n📋 ${name}`);
    await fn();
  };

  try {
    driver = await createDriver(process.env.HEADLESS === 'true');

    await describe('Page Load', async () => {
      await test('should load the profile page successfully', async () => {
        await driver.get(`${BASE_URL}/profile`);
        
        // Wait for page to load
        await driver.wait(until.titleContains('Michael Simoneau'), 10000);
        
        const title = await driver.getTitle();
        assert(title.includes('Michael Simoneau'), `Title should contain "Michael Simoneau", got: ${title}`);
        assert(title.includes('Full Professional Profile'), `Title should contain "Full Professional Profile", got: ${title}`);
      })();

      await test('should display the main heading', async () => {
        await driver.get(`${BASE_URL}/profile`);
        
        const heading = await driver.findElement(By.css('h1'));
        const headingText = await heading.getText();
        
        assert(headingText === 'Michael Simoneau', `Heading should be "Michael Simoneau", got: ${headingText}`);
      })();
    });

    await describe('Contact Information Links', async () => {
      await test('should have "Contact on LinkedIn" link with correct URL', async () => {
        await driver.get(`${BASE_URL}/profile`);
        await driver.wait(until.elementLocated(By.css('h1')), 10000);
        
        // Find the link by text content
        const links = await driver.findElements(By.css('a'));
        let contactLink: WebElement | null = null;
        
        for (const link of links) {
          const text = await link.getText();
          if (text.includes('Contact on LinkedIn')) {
            contactLink = link;
            break;
          }
        }
        
        assert(contactLink !== null, 'Contact on LinkedIn link should exist');
        
        const href = await contactLink.getAttribute('href');
        assert(href === 'https://linkedin.com/in/michaelsimoneau', `LinkedIn href should be "https://linkedin.com/in/michaelsimoneau", got: ${href}`);
        
        // Verify link is clickable (enabled)
        const isEnabled = await contactLink.isEnabled();
        assert(isEnabled === true, 'Contact on LinkedIn link should be enabled');
      })();

      await test('should have email link with correct mailto URL', async () => {
        await driver.get(`${BASE_URL}/profile`);
        await driver.wait(until.elementLocated(By.css('h1')), 10000);
        
        const emailLinks = await driver.findElements(By.css('a[href^="mailto:"]'));
        
        let emailLink: WebElement | null = null;
        for (const link of emailLinks) {
          const href = await link.getAttribute('href');
          if (href === 'mailto:email@michaelsimoneau.com') {
            emailLink = link;
            break;
          }
        }
        
        assert(emailLink !== null, 'Email link should exist');
        
        const href = await emailLink.getAttribute('href');
        assert(href === 'mailto:email@michaelsimoneau.com', `Email href should be "mailto:email@michaelsimoneau.com", got: ${href}`);
        
        const text = await emailLink.getText();
        assert(text === 'email@michaelsimoneau.com', `Email text should be "email@michaelsimoneau.com", got: ${text}`);
      })();
    });

    await describe('Links & Profiles Section', async () => {
      await test('should have LinkedIn profile link with correct URL', async () => {
        await driver.get(`${BASE_URL}/profile`);
        await driver.wait(until.elementLocated(By.css('h1')), 10000);
        
        const linkedInLink = await driver.findElement(
          By.css('a[href="https://linkedin.com/in/michaelsimoneau"]')
        );
        
        const href = await linkedInLink.getAttribute('href');
        assert(href === 'https://linkedin.com/in/michaelsimoneau', `LinkedIn href should be "https://linkedin.com/in/michaelsimoneau", got: ${href}`);
        
        const text = await linkedInLink.getText();
        assert(text === 'MichaelSimoneau', `LinkedIn text should be "MichaelSimoneau", got: ${text}`);
        
        const isEnabled = await linkedInLink.isEnabled();
        assert(isEnabled === true, 'LinkedIn link should be enabled');
      })();

      await test('should have GitHub link with correct URL', async () => {
        await driver.get(`${BASE_URL}/profile`);
        await driver.wait(until.elementLocated(By.css('h1')), 10000);
        
        const githubLink = await driver.findElement(
          By.css('a[href="https://github.com/MichaelSimoneau"]')
        );
        
        const href = await githubLink.getAttribute('href');
        assert(href === 'https://github.com/MichaelSimoneau', `GitHub href should be "https://github.com/MichaelSimoneau", got: ${href}`);
        
        const text = await githubLink.getText();
        assert(text === 'MichaelSimoneau', `GitHub text should be "MichaelSimoneau", got: ${text}`);
        
        const isEnabled = await githubLink.isEnabled();
        assert(isEnabled === true, 'GitHub link should be enabled');
      })();
    });

    await describe('Content Verification', async () => {
      await test('should display "Leader, Inventor & Investor" text', async () => {
        await driver.get(`${BASE_URL}/profile`);
        await driver.wait(until.elementLocated(By.css('h1')), 10000);
        
        const bodyText = await driver.findElement(By.tagName('body')).getText();
        assert(bodyText.includes('Leader, Inventor & Investor'), 'Body should contain "Leader, Inventor & Investor"');
      })();

      await test('should display "20+ Years Experience" stat', async () => {
        await driver.get(`${BASE_URL}/profile`);
        await driver.wait(until.elementLocated(By.css('h1')), 10000);
        
        const bodyText = await driver.findElement(By.tagName('body')).getText();
        assert(bodyText.includes('20+'), 'Body should contain "20+"');
        assert(bodyText.includes('Years Experience'), 'Body should contain "Years Experience"');
      })();

      await test('should display experience section with expected companies', async () => {
        await driver.get(`${BASE_URL}/profile`);
        await driver.wait(until.elementLocated(By.css('h1')), 10000);
        
        const bodyText = await driver.findElement(By.tagName('body')).getText();
        
        assert(bodyText.includes('JPMorgan'), 'Body should contain "JPMorgan"');
        assert(bodyText.includes('StoneX'), 'Body should contain "StoneX"');
        assert(bodyText.includes('Enigma Key'), 'Body should contain "Enigma Key"');
      })();

      await test('should display education section', async () => {
        await driver.get(`${BASE_URL}/profile`);
        await driver.wait(until.elementLocated(By.css('h1')), 10000);
        
        const bodyText = await driver.findElement(By.tagName('body')).getText();
        
        assert(bodyText.includes('Education'), 'Body should contain "Education"');
        assert(bodyText.includes('University of London'), 'Body should contain "University of London"');
        assert(bodyText.includes('Cleveland State University'), 'Body should contain "Cleveland State University"');
      })();
    });

    await describe('SEO Word Density', async () => {
      await test('should have "Michael Simoneau" phrase density approximately 5%', async () => {
        await driver.get(`${BASE_URL}/profile`);
        await driver.wait(until.elementLocated(By.css('h1')), 10000);
        
        // Get all text content from the page
        const bodyText = await driver.findElement(By.tagName('body')).getText();
        
        // Count occurrences of "Michael Simoneau" (case-insensitive)
        const searchPhrase = 'Michael Simoneau';
        const regex = new RegExp(searchPhrase.replace(/\s+/g, '\\s+'), 'gi');
        const matches = bodyText.match(regex);
        const occurrenceCount = matches ? matches.length : 0;
        
        // Count total words (split by whitespace and filter out empty strings)
        const words = bodyText
          .split(/\s+/)
          .filter(word => word.length > 0)
          .map(word => word.replace(/[^\w]/g, ''))
          .filter(word => word.length > 0);
        
        const totalWords = words.length;
        
        // Calculate phrase density: (phrase occurrences / total words) * 100
        // This measures how often the phrase "Michael Simoneau" appears relative to total word count
        const phraseDensity = (occurrenceCount / totalWords) * 100;
        
        // Assert density is approximately 5% (4.5% - 5.5% range)
        assert(phraseDensity >= 4.5, `Phrase density should be >= 4.5%, got: ${phraseDensity.toFixed(2)}%`);
        assert(phraseDensity <= 5.5, `Phrase density should be <= 5.5%, got: ${phraseDensity.toFixed(2)}%`);
        
        console.log(`  "Michael Simoneau" phrase density: ${phraseDensity.toFixed(2)}%`);
        console.log(`  Phrase occurrences: ${occurrenceCount}, Total words: ${totalWords}`);
        console.log(`  Expected range: 4.5% - 5.5%`);
      })();

      await test('should verify "Michael Simoneau" appears in copy content', async () => {
        await driver.get(`${BASE_URL}/profile`);
        await driver.wait(until.elementLocated(By.css('h1')), 10000);
        
        // Get all text content from the page
        const bodyText = await driver.findElement(By.tagName('body')).getText();
        
        // Count occurrences of "Michael Simoneau" (case-insensitive)
        const searchPhrase = 'Michael Simoneau';
        const regex = new RegExp(searchPhrase.replace(/\s+/g, '\\s+'), 'gi');
        const matches = bodyText.match(regex);
        const occurrenceCount = matches ? matches.length : 0;
        
        // Verify it appears multiple times in the copy (not just in headings/metadata)
        assert(occurrenceCount >= 10, `"Michael Simoneau" should appear at least 10 times in the copy, found: ${occurrenceCount}`);
        
        console.log(`  "Michael Simoneau" appears ${occurrenceCount} times in the page content`);
      })();
    });

    await describe('SEO Meta Tags', async () => {
      await test('should have correct page title meta tag', async () => {
        await driver.get(`${BASE_URL}/profile`);
        await driver.wait(until.elementLocated(By.css('h1')), 10000);
        
        const title = await driver.getTitle();
        assert(title.includes('Michael Simoneau'), `Title should contain "Michael Simoneau", got: ${title}`);
        assert(title.includes('Full Professional Profile'), `Title should contain "Full Professional Profile", got: ${title}`);
      })();

      await test('should have description meta tag', async () => {
        await driver.get(`${BASE_URL}/profile`);
        await driver.wait(until.elementLocated(By.css('h1')), 10000);
        
        const descriptionMeta = await driver.findElement(
          By.css('meta[name="description"]')
        );
        const description = await descriptionMeta.getAttribute('content');
        
        assert(description !== null && description !== undefined, 'Description meta tag should exist');
        assert(description.includes('Michael Simoneau'), `Description should contain "Michael Simoneau", got: ${description}`);
        assert(description.includes('20+ years'), `Description should contain "20+ years", got: ${description}`);
      })();

      await test('should have Open Graph meta tags', async () => {
        await driver.get(`${BASE_URL}/profile`);
        await driver.wait(until.elementLocated(By.css('h1')), 10000);
        
        const ogTitle = await driver.findElement(
          By.css('meta[property="og:title"]')
        );
        const ogTitleContent = await ogTitle.getAttribute('content');
        assert(ogTitleContent.includes('Michael Simoneau'), `OG title should contain "Michael Simoneau", got: ${ogTitleContent}`);
        
        const ogDescription = await driver.findElement(
          By.css('meta[property="og:description"]')
        );
        const ogDescriptionContent = await ogDescription.getAttribute('content');
        assert(ogDescriptionContent !== null && ogDescriptionContent !== undefined, 'OG description should exist');
        
        const ogUrl = await driver.findElement(
          By.css('meta[property="og:url"]')
        );
        const ogUrlContent = await ogUrl.getAttribute('content');
        assert(ogUrlContent.includes('/profile'), `OG URL should contain "/profile", got: ${ogUrlContent}`);
      })();

      await test('should have structured data (JSON-LD) in page source', async () => {
        await driver.get(`${BASE_URL}/profile`);
        await driver.wait(until.elementLocated(By.css('h1')), 10000);
        
        const pageSource = await driver.getPageSource();
        
        // Check for JSON-LD script tag
        assert(pageSource.includes('application/ld+json'), 'Page source should contain "application/ld+json"');
        
        // Check for Person schema type
        assert(pageSource.includes('"@type":"Person"'), 'Page source should contain Person schema type');
        assert(pageSource.includes('Michael Simoneau'), 'Page source should contain "Michael Simoneau"');
        
        // Check for correct URLs in sameAs
        assert(pageSource.includes('linkedin.com/in/michaelsimoneau'), 'Page source should contain LinkedIn URL');
        assert(pageSource.includes('github.com/MichaelSimoneau'), 'Page source should contain GitHub URL');
      })();

      await test('should have canonical URL link', async () => {
        await driver.get(`${BASE_URL}/profile`);
        await driver.wait(until.elementLocated(By.css('h1')), 10000);
        
        const canonicalLink = await driver.findElement(
          By.css('link[rel="canonical"]')
        );
        const href = await canonicalLink.getAttribute('href');
        
        assert(href.includes('/profile'), `Canonical URL should contain "/profile", got: ${href}`);
      })();
    });

    // Cleanup
    if (driver) {
      await driver.quit();
    }

    // Print summary
    console.log(`\n📊 Test Summary:`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📈 Total: ${passedTests + failedTests}`);
    
    if (failedTests > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Test suite error:', error);
    if (driver) {
      await driver.quit();
    }
    process.exit(1);
  }
}

// Run tests when executed directly
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

export { runTests };

