const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');

module.exports = function (app) {
    app.use(express.static('temp'));

    app.get('/api/analyze', async (req, res, next) => {
        res.header('Access-Control-Allow-Origin', 'http://localhost:3301');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Pragma-directive', 'no-cache');
        res.header('Cache-directive', 'no-cache');
        res.header('Cache-control', 'o-cache');
        res.header('Pragma', 'no-cache');
        res.header('Expires', '0');

        const { url } = req.query;
        const { size } = req.query;
        const factorData = {};

        const fontSizeSmallLimit = 13;

        try {
            await (async () => {
                const browser = await puppeteer.launch();
                const page = await browser.newPage();

                if (size === '1024x768') {
                    await page.setViewport({
                        width: 1024,
                        height: 768,
                    });
                }

                await page.goto(url);

                page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

                // Get the "viewport" of the page, as reported by the page.

                const inputData = {
                    fontSizeSmallLimit,
                };

                const data = await page.evaluate(async (inputData) => {
                    let smallTextCount = 0;
                    const all = document.querySelectorAll('body *');

                    // Mark letters with too small letters
                    for (let i = 0, max = all.length; i < max; i++) {
                        const currentEl = all[i];
                        let text = [].reduce.call(currentEl.childNodes, (a, b) => a + (b.nodeType === Node.TEXT_NODE ? b.textContent : ''), '');
                        text = text.trim();

                        console.log(text);
                        console.log(getComputedStyle(currentEl).fontSize);

                        if (text !== '' && parseInt(getComputedStyle(currentEl).fontSize, 10) < inputData.fontSizeSmallLimit) {
                            currentEl.style.border = 'solid 1px red';
                            smallTextCount++;
                        }
                    }

                    // Get Style
                    const css = [];
                    for (var i = 0; i < document.styleSheets.length; i++) {
                        const sheet = document.styleSheets[i];
                        const rules = ('cssRules' in sheet) ? sheet.cssRules : sheet.rules;
                        if (rules) {
                            css.push(`\n/* Stylesheet : ${sheet.href || '[inline styles]'} */`);
                            for (let j = 0; j < rules.length; j++) {
                                const rule = rules[j];
                                if ('cssText' in rule) css.push(rule.cssText);
                                else css.push(`${rule.selectorText} {\n${rule.style.cssText}\n}\n`);
                            }
                        }
                    }
                    const cssString = `${css.join('\n')}\n`;

                    // Remove CSS linking from HTML
                    const hs = document.querySelectorAll('link[rel="stylesheet"]');
                    for (var i = 0, max = hs.length; i < max; i++) {
                        hs[i].parentNode.removeChild(hs[i]);
                    }

                    // Add style to head
                    const head = document.head || document.getElementsByTagName('head')[0];
                    const style = document.createElement('style');
                    head.appendChild(style);
                    style.appendChild(document.createTextNode(cssString));

                    // Get Entire HTML
                    const htmlString = document.documentElement.innerHTML;

                    return {
                        html: htmlString,
                        smallTextCount,
                    };
                }, inputData);

                fs.mkdirSync('./temp', { recursive: true });
                fs.writeFileSync('./temp/result-1.html', data.html);
                await page.screenshot({ path: './temp/result-1.png' });

                factorData.smallTextCount = data.smallTextCount;

                await browser.close();
            })();
        } catch (error) {
            console.log(error);
        }

        const desc = `The page has ${factorData.smallTextCount} element(s) with too small font size (less than ${fontSizeSmallLimit} px).`;

        res.json({
            inputURL: url,
            inputSize: size,
            factorData,
            resultHtmlURL: 'result-1.html',
            resultScreenshotURL: 'result-1.png',
            analysisDescription: desc,
        });
    });
};
