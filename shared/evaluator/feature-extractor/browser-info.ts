import { BrowserInfoExtractResult } from "types/feature-extractor";

export function browserInfo(win: Window): BrowserInfoExtractResult {
    const userAgent = win.navigator.userAgent;
    const body = win.document.body;
    const html = win.document.documentElement;

    const url = win.location.href;
    const vw = Math.max(win.document.documentElement.clientWidth || 0, win.innerWidth || 0);
    const vh = Math.max(win.document.documentElement.clientHeight || 0, win.innerHeight || 0);
    const scrollHeight = Math.max( body.scrollHeight, body.offsetHeight, 
                           html.clientHeight, html.scrollHeight, html.offsetHeight );
    const scrollWidth = Math.max( body.scrollWidth, body.offsetWidth, 
                            html.clientWidth, html.scrollWidth, html.offsetWidth );

    return {
        url,
        userAgent,
        viewportWidth: vw,
        viewportHeight: vh,
        scrollHeight,
        scrollWidth
    };
}
