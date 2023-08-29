const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the URL with Puppeteer
    await page.goto('https://waitingroom.thesmithcenter.com/?c=smithcenter&e=everyday&ver=v3-javascript-3.7.4&cver=113&man=Safetynet&t=https%3A%2F%2Fthesmithcenter.com%2Ftickets%2F2324%2Fbeetlejuice%2F&kupver=cloudflare-1.2.3');

    // Wait for the page to load (you can adjust the timeout as needed)
    await page.waitForTimeout(5000);

    // Get the final URL after redirection
    const finalUrl = page.url();
    console.log('Final URL:', finalUrl);

    // You can further interact with the page here if needed

    await browser.close();
})();
