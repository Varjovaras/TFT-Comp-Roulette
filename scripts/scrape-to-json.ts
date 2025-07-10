import { chromium } from 'playwright';
import * as cheerio from 'cheerio';
import { writeFileSync } from 'fs';

(async () => {
	const targetUrl = 'https://www.metatft.com/comps';
	const browser = await chromium.launch();
	const page = await browser.newPage();
	await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
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
	const html = await page.content();
	await browser.close();

	// // Save the full HTML for debugging
	// writeFileSync('scraped_data.html', html);

	const $ = cheerio.load(html);
	console.log('CompRow count:', $('.CompRow').length);
	console.log('Comp_Title count:', $('.Comp_Title').length);
	// Count skeletons (placeholders)
	const skeletonRows = $('.CompRowPlaceholder').length;
	const skeletonTitles = $('.CompTitlePlaceholder').length;
	console.log('CompRowPlaceholder (skeleton) count:', skeletonRows);
	console.log('CompTitlePlaceholder (skeleton) count:', skeletonTitles);
	const scrapedComps: { name: string; link: string; color: string }[] = [];
	$('.CompRow').each((i, row) => {
		const $row = $(row);

		if ($row.hasClass('CompRowPlaceholder')) return;

		const title = $row.find('.Comp_Title').first();
		const name = title.text().trim();
		if (!name) return;

		const compNameDiv = $row.find('.CompRowName');
		const compNameDivId = compNameDiv.attr('id');
		let link = '';
		if (compNameDivId) {
			link = `https://www.metatft.com/comps#${compNameDivId}`;
		}

		let color = '';
		const badge = $row.find('.CompRowTierBadge');
		if (badge.length) {
			const tier = badge.text().trim();
			if (tier === 'S') color = '#FFD700';
			else if (tier === 'A') color = '#4b69ff';
			else if (tier === 'B') color = '#8847ff';
			else if (tier === 'C') color = '#b0c3d9';
			else if (tier === 'D') color = '#eb4b4b';
		}

		if (name && link) {
			scrapedComps.push({ name, link, color });
		}
	});
	writeFileSync('static/comps.json', JSON.stringify(scrapedComps, null, 2));
	console.log(`Scraped ${scrapedComps.length} comps to static/comps.json`);
})();
