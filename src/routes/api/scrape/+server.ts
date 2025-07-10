import { json } from '@sveltejs/kit';
import { chromium, type Page } from 'playwright';
import * as cheerio from 'cheerio';

export async function GET() {


	let browser;
	try {
		const targetUrl = 'https://www.metatft.com/comps';
		browser = await chromium.launch();
		const page = await browser.newPage();

		await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

		// Wait for the main content layout to appear
		await page.waitForSelector('.MetaTFTLayout', { timeout: 30000 });

		// Function to scroll down and load more content until no new comps are found
		async function autoScrollAndLoad(page: Page) {
			let previousCompCount = 0;
			let currentCompCount = 0;
			let scrollAttempts = 0;

			while (true) {
				await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
				await page.waitForTimeout(2000); // Wait for content to load

				const newCompCount = await page.evaluate(() => document.querySelectorAll('.CompRow').length);

				if (newCompCount === currentCompCount) {
					scrollAttempts++;
					if (scrollAttempts >= 3) { // If no new comps after 3 attempts, stop
						break;
					}
				} else {
					scrollAttempts = 0; // Reset attempts if new content is found
				}

				currentCompCount = newCompCount;

				if (currentCompCount === previousCompCount && scrollAttempts >= 3) {
					break;
				}
				previousCompCount = currentCompCount;
			}
		}

		await autoScrollAndLoad(page); // Scroll and load all content
		await page.waitForLoadState('networkidle', { timeout: 60000 }); // Ensure all network requests are done

		console.time('Scraping Duration');
		const html = await page.content(); // Get the full HTML content after rendering
		console.timeEnd('Scraping Duration');
		const $ = cheerio.load(html);

		const scrapedComps: { name: string; link: string, color: string }[] = [];

		// Iterate over each comp row
		$('.CompRow').each((i, element) => {
			const compNameDiv = $(element).find('.CompRowName');
			const compNameDivId = compNameDiv.attr('id');

			// Use the id as the name (or parse it for a better display name if needed)
			const name = compNameDivId ? compNameDivId.replace(/TFT14_/g, '').replace(/-/g, ', ').replace(/_/g, ' ') : '';
			let link = '';

			if (compNameDivId) {
				link = `https://www.metatft.com/comps#${compNameDivId}`;
			}

			// Extract color from the comp row if available
			const compRow = $(element);
			let color = '';
			// Try to get color from the badge or style (adjust selector as needed)
			const badge = compRow.find('.CompRowTierBadge');
			if (badge.length) {
				// Example: S, A, B, C, D
				const tier = badge.text().trim();
				// Map tier to color (adjust as needed)
				if (tier === 'S') color = '#FFD700'; // Gold
				else if (tier === 'A') color = '#4b69ff'; // Blue
				else if (tier === 'B') color = '#8847ff'; // Purple
				else if (tier === 'C') color = '#b0c3d9'; // Gray
				else if (tier === 'D') color = '#eb4b4b'; // Red
			}

			if (name && link) {
				scrapedComps.push({ name, link, color });
			}
		});

		return json({ success: true, data: scrapedComps });
	} catch (error) {
		console.error('Scraping failed:', error);
		return json(
			{ success: false, message: 'Failed to scrape data', error: error },
			{ status: 500 }
		);
	} finally {
		if (browser) {
			await browser.close();
		}
	}
}
