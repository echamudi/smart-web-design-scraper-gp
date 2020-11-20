import { BrowserInfoExtractResult, NegativeSpaceExtractResult } from "Shared/types/factors";
import { isVisible } from 'Shared/utils/is-visible';
import { textDetectionExtract } from "./text-detection";

export function negativeSpace(win: Window, doc: Document, browserInfoResult: BrowserInfoExtractResult): NegativeSpaceExtractResult {
    const {
        scrollHeight,
        scrollWidth,
        componentCount: textElementCount,
        components
    } = textDetectionExtract(win, doc, browserInfoResult);

    return {
        scrollWidth,
        scrollHeight,
        textElementCount,
        components
    };
}
