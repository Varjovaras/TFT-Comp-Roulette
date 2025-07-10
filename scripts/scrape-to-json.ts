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
    let previousCompCount = 0;
    let currentCompCount = 0;
    let scrollAttempts = 0;
    while (true) {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(2000);
        const newCompCount = await page.evaluate(() => document.querySelectorAll('.CompRow').length);
        if (newCompCount === currentCompCount) {
            scrollAttempts++;
            if (scrollAttempts >= 3) break;
        } else {
            scrollAttempts = 0;
        }
        currentCompCount = newCompCount;
        if (currentCompCount === previousCompCount && scrollAttempts >= 3) break;
        previousCompCount = currentCompCount;
    }
    const html = await page.content();
    await browser.close();

    const $ = cheerio.load(html);
    const scrapedComps: { name: string; link: string; color: string }[] = [];
    $('.CompRow').each((i, element) => {
        const compNameDiv = $(element).find('.CompRowName');
        const compNameDivId = compNameDiv.attr('id');
        const name = compNameDivId ? compNameDivId.replace(/TFT14_/g, '').replace(/-/g, ', ').replace(/_/g, ' ') : '';
        let link = '';
        if (compNameDivId) {
            link = `https://www.metatft.com/comps#${compNameDivId}`;
        }
        const compRow = $(element);
        let color = '';
        const badge = compRow.find('.CompRowTierBadge');
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
