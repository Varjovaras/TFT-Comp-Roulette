import { chromium } from 'playwright';
import { Redis } from '@upstash/redis';

(async () => {
	const targetUrl = 'https://www.metatft.com/comps';
	const context = await chromium.launchPersistentContext('', {
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	});
	await context.grantPermissions(['clipboard-read', 'clipboard-write']);
	const page = await context.newPage();

	// Inject code to intercept clipboard write
	await page.addInitScript(() => {
		(window as any).__lastClipboardText = '';
		const originalWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);
		navigator.clipboard.writeText = async (text: string) => {
			(window as any).__lastClipboardText = text;
			return Promise.resolve();
		};
	});

	try {
		await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

		// Handle cookie consent banners
		const consentButtonSelectors = [
			'button:has-text("Accept")',
			'button:has-text("Agree")',
			'button:has-text("OK")',
			'button:has-text("I agree")',
			'[aria-label="Accept all"]',
			'#qc-cmp2-ui button[mode="primary"]' // Specific selector for the observed dialog
		];

		for (const selector of consentButtonSelectors) {
			try {
				await page.click(selector, { timeout: 5000 });
				console.log(`Clicked consent button with selector: ${selector}`);
				await page.waitForTimeout(1000); // Wait for the dialog to disappear
				break; // Exit loop if a button is successfully clicked
			} catch {
				// Ignore errors if the button is not found
			}
		}

		await page.waitForSelector('.MetaTFTLayout', { timeout: 30000 });

		// Scroll to load all comps
		let currentCompCount = 0;
		let currentTitleCount = 0;
		let scrollAttempts = 0;
		let placeholderAttempts = 0;
		while (true) {
			await page.evaluate(() => {
				window.scrollBy(0, window.innerHeight / 2);
			});
			await page.mouse.move(100, 100);
			await page.waitForTimeout(1000);
			const newCompCount = await page.evaluate(() => document.querySelectorAll('.CompRow').length);
			const newTitleCount = await page.evaluate(
				() => document.querySelectorAll('.Comp_Title').length
			);
			const skeletonRows = await page.evaluate(
				() => document.querySelectorAll('.CompRowPlaceholder').length
			);
			const skeletonTitles = await page.evaluate(
				() => document.querySelectorAll('.CompTitlePlaceholder').length
			);
			console.log(
				'CompRow:',
				newCompCount,
				'Comp_Title:',
				newTitleCount,
				'SkeletonRows:',
				skeletonRows,
				'SkeletonTitles:',
				skeletonTitles
			);

			if (skeletonRows === 0 && skeletonTitles === 0) {
				placeholderAttempts++;
				if (placeholderAttempts >= 3) break;
			} else {
				placeholderAttempts = 0;
			}
			if (newCompCount === currentCompCount && newTitleCount === currentTitleCount) {
				scrollAttempts++;
				if (scrollAttempts >= 30) break;
			} else {
				scrollAttempts = 0;
			}
			currentCompCount = newCompCount;
			currentTitleCount = newTitleCount;
		}

		await page.waitForTimeout(3000);

		const scrapedComps: {
			name: string;
			link: string;
			color: string;
			teamCode: string;
			tier: string;
		}[] = [];
		const compRows = await page.$$('.CompRow');

		for (const rowHandle of compRows) {
			const isPlaceholder = await rowHandle.$('.CompRowPlaceholder');
			if (isPlaceholder) continue;

			const nameEl = await rowHandle.$('.Comp_Title');
			if (!nameEl) continue;

			const name = await nameEl.textContent();
			if (!name) continue;

			const compNameDivId = await rowHandle.$eval('.CompRowName', (el) => el.id || '');
			let link = '';
			if (compNameDivId) {
				link = `https://www.metatft.com/comps#${compNameDivId}`;
			}

			let color = '';
			let tier = '';
			const badge = await rowHandle.$('.CompRowTierBadge');
			if (badge) {
				tier = (await badge.textContent())?.trim() || '';
				if (tier === 'S') color = '#FFD700';
				else if (tier === 'A') color = '#4b69ff';
				else if (tier === 'B') color = '#8847ff';
				else if (tier === 'C') color = '#b0c3d9';
				else if (tier === 'D') color = '#eb4b4b';
			}

			const copyButton = await rowHandle.$('.CopyTeamCode');
			let teamCode = '';
			if (copyButton) {
				await copyButton.click({ force: true });
				// Retrieve the captured code from the browser context
				teamCode = await page.evaluate(() => (window as any).__lastClipboardText || '');
			}

			if (name.trim() && link) {
				scrapedComps.push({ name: name.trim(), link, color, teamCode, tier });
			}
		}

		console.log(`Scraped ${scrapedComps.length} comps`);

		const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
		const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

		if (redisUrl && redisToken) {
			const redis = new Redis({
				url: redisUrl,
				token: redisToken
			});
			await redis.set('tft_comps', JSON.stringify(scrapedComps));
			console.log('Successfully pushed comps to Redis');
		} else {
			console.warn('Redis credentials not found. Skipping push to database (and local file).');
		}
	} catch (error) {
		console.error('An error occurred during scraping:', error);
		const html = await page.content();
		const { writeFileSync } = await import('fs');
		writeFileSync('scraped_data_error.html', html);
	} finally {
		await context.close();
	}
})();
