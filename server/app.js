const express = require('express')
const app = express()
const port = 3302
const puppeteer = require('puppeteer');
const fs = require('fs');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3301");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static('temp'))

app.get('/api/analyze', async (req, res, next) => {
    let url = req.query.url;
    let size = req.query.size;
    let factorData = {};

    let fontSizeSmallLimit = 13;

    try {
        await (async () => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            if (size === "1024x768") {
                await page.setViewport({
                    width: 1024,
                    height: 768
                });
            }

            await page.goto(url);

            page.on('console', msg => console.log('PAGE LOG:', msg.text()));

            // Get the "viewport" of the page, as reported by the page.

            let inputData = {
                fontSizeSmallLimit: fontSizeSmallLimit
            };

            const data = await page.evaluate(async (inputData) => {
                let smallTextCount = 0;
                let all = document.querySelectorAll("body *");

                // Mark letters with too small letters
                for (let i = 0, max = all.length; i < max; i++) {
                    let currentEl = all[i];
                    let text = [].reduce.call(currentEl.childNodes, function (a, b) { return a + (b.nodeType === Node.TEXT_NODE ? b.textContent : ''); }, '');
                    text = text.trim();

                    console.log(text);
                    console.log(getComputedStyle(currentEl).fontSize);

                    if (text !== '' && parseInt(getComputedStyle(currentEl).fontSize, 10) < inputData.fontSizeSmallLimit) {
                        currentEl.style.border = 'solid 1px red';
                        smallTextCount++;
                    }
                }

                // Get Style
                var css = [];
                for (var i = 0; i < document.styleSheets.length; i++) {
                    var sheet = document.styleSheets[i];
                    var rules = ('cssRules' in sheet) ? sheet.cssRules : sheet.rules;
                    if (rules) {
                        css.push('\n/* Stylesheet : ' + (sheet.href || '[inline styles]') + ' */');
                        for (var j = 0; j < rules.length; j++) {
                            var rule = rules[j];
                            if ('cssText' in rule)
                                css.push(rule.cssText);
                            else
                                css.push(rule.selectorText + ' {\n' + rule.style.cssText + '\n}\n');
                        }
                    }
                }
                var cssString = css.join('\n') + '\n';

                // Remove CSS linking from HTML
                var hs = document.querySelectorAll('link[rel="stylesheet"]');
                for (var i = 0, max = hs.length; i < max; i++) {
                    hs[i].parentNode.removeChild(hs[i]);
                }

                // Add style to head
                let head = document.head || document.getElementsByTagName('head')[0];
                let style = document.createElement('style');
                head.appendChild(style);
                style.appendChild(document.createTextNode(cssString));

                // Get Entire HTML
                var htmlString = document.documentElement.innerHTML;

                return {
                    html: htmlString,
                    smallTextCount: smallTextCount
                };
            }, inputData);

            fs.mkdirSync('./temp', { recursive: true });
            fs.writeFileSync("./temp/result-1.html", data.html);
            await page.screenshot({path: './temp/result-1.png'});

            factorData.smallTextCount = data.smallTextCount;

            await browser.close();
        })();
    } catch (error) {
        console.log(error);
    }

    let desc = `The page has ${factorData.smallTextCount} element(s) with too small font size (less than ${fontSizeSmallLimit} px).`;

    res.json({
        inputURL: url,
        inputSize: size,
        factorData: factorData,
        resultHtmlURL: "result-1.html",
        resultScreenshotURL: "result-1.png",
        analysisDescription: desc
    });
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))