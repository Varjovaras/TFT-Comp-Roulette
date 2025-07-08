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

        // Add a short delay to allow dynamic content to render within the layout
        await page.waitForTimeout(3000); // Wait for 3 seconds

        const html = await page.content(); // Get the full HTML content after rendering
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
        return json({ success: false, message: 'Failed to scrape data', error: error.message }, { status: 500 });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}