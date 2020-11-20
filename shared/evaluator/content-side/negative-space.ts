import { BrowserInfoExtractResult, NegativeSpaceExtractResult, TextDetectionExtractResult } from "Shared/types/factors";
import { isVisible } from 'Shared/utils/is-visible';
import { textDetectionExtract } from "./text-detection";

export function negativeSpace(
    browserInfoResult: BrowserInfoExtractResult,
    textDetectionExtractResult: TextDetectionExtractResult): NegativeSpaceExtractResult {

    const {
        componentCount: textElementCount,
        components
    } = textDetectionExtractResult;

    return {
        scrollWidth: browserInfoResult.scrollWidth,
        scrollHeight: browserInfoResult.scrollHeight,
        textElementCount,
        components
    };
}
