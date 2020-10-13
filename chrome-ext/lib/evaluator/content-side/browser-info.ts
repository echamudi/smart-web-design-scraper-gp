import { BrowserInfoResult } from "Shared/types/factors";

export function browserInfo(win: Window): BrowserInfoResult {
    const userAgent = win.navigator.userAgent;

    const url = win.location.href;
    const vw = Math.max(win.document.documentElement.clientWidth || 0, win.innerWidth || 0);
    const vh = Math.max(win.document.documentElement.clientHeight || 0, win.innerHeight || 0);

    return {
        url,
        userAgent,
        viewportWidth: vw,
        viewportHeight: vh
    };
}
