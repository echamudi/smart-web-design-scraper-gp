const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('http://localhost:9988/page1.html');

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    // Get the "viewport" of the page, as reported by the page.
    const data = await page.evaluate(() => {
        let all = document.querySelectorAll("body *");

        for (let i = 0, max = all.length; i < max; i++) {
            let currentEl = all[i];
            let text = [].reduce.call(currentEl.childNodes, function(a, b) { return a + (b.nodeType === Node.TEXT_NODE ? b.textContent : ''); }, '');
            text = text.trim();

            console.log(text);
            console.log(getComputedStyle(currentEl).fontSize);

            if(text !== '' && parseInt(getComputedStyle(currentEl).fontSize, 10) < 12) {
                currentEl.style.border = 'solid 1px red';
            }
        }

        return {
            data: all
        };
    });

    const html = await page.content();
    fs.writeFileSync("./test/sample-site/page1-test.html", html);

    await browser.close();
})();
