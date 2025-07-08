import { json } from '@sveltejs/kit';
import { chromium } from 'playwright';
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
		async function autoScrollAndLoad(page) {
			let previousCompCount = 0;
			let currentCompCount = 0;
			let scrollAttempts = 0;
			const maxScrollAttempts = 10; // Limit to prevent infinite loops

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

		const scrapedComps: { name: string; link: string }[] = [];

		// Iterate over each comp row
		$('.CompRow').each((i, element) => {
			const compTitleElement = $(element).find('.Comp_Title');
			const compNameDivId = $(element).find('.CompRowName').attr('id');

			const name = compTitleElement.text().trim();
			let link = '';

			if (compNameDivId) {
				// Construct the link using the ID from CompRowName with a hash
				link = `https://www.metatft.com/comps#${compNameDivId}`;
			}

			if (name && link) {
				scrapedComps.push({ name, link });
			}
		});

		return json({ success: true, data: scrapedComps });
	} catch (error: any) {
		console.error('Scraping failed:', error);
		return json(
			{ success: false, message: 'Failed to scrape data', error: error.message },
			{ status: 500 }
		);
	} finally {
		if (browser) {
			await browser.close();
		}
	}
}
