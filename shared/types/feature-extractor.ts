// Feature EXTRACTOR

import { ElementPosition } from "./types";

// All Results

export interface FeatureExtractorResult {
    browserInfo: BrowserInfoExtractResult,
    textElements: TextElementsExtractResult,
    imageElements: ImageElementsExtractResult,
    videoElements: VideoElementsExtractResult,
    anchorElements: AnchorElementsExtractResult
}

// browser-info

export interface BrowserInfoExtractResult {
    url: string,
    userAgent: string,
    viewportWidth: number,
    viewportHeight: number,
    scrollHeight: number,
    scrollWidth: number,
}

// element-detection

export interface GenericElement {
    position: ElementPosition,

    area: number, // width x height
    visible: boolean,
};

export interface GenericElementsExtractResult {
    elements: GenericElement[],
    /**
     * Number of elements in the page (visible + invisible)
     */
    elementCount: number,
    /**
     * Number of elements in the page (visible only)
     */
    visibleElementCount: number,
    scrollWidth: number,
    scrollHeight: number,
}

// text-detection

export interface TextElement {
    position: ElementPosition,

    fontType: string,
    fontSize: string,
    color: string,
    backgroundColor: string,
    fontWeight: string,
    visible: boolean,
    totalCharacters: number
}

export interface TextElementsExtractResult {
    elements: TextElement[],
    /**
     * Number of elements in the page (visible + invisible)
     */
    elementCount: number,
    /**
     * Number of elements in the page (visible only)
     */
    visibleElementCount: number,
    scrollWidth: number,
    scrollHeight: number,
}

// image-detection

export interface ImageElement {
    position: ElementPosition,

    url: string,
    tagName: string,
    area: number, // width x height
    visible: boolean,
}

export interface ImageElementsExtractResult {
    elements: ImageElement[],
    /**
     * Number of elements in the page (visible + invisible)
     */
    elementCount: number,
    /**
     * Number of elements in the page (visible only)
     */
    visibleElementCount: number,
    scrollWidth: number,
    scrollHeight: number,
}

// video-detection

export interface VideoElement {
    position: ElementPosition,

    url: string,
    tagName: string,
    area: number, // width x height
    visible: boolean,
}

export interface VideoElementsExtractResult {
    elements: VideoElement[],
    /**
     * Number of elements in the page (visible + invisible)
     */
    elementCount: number,
    /**
     * Number of elements in the page (visible only)
     */
    visibleElementCount: number,
    scrollWidth: number,
    scrollHeight: number,
}

// anchor-detection

export interface AnchorElement {
    position: ElementPosition,

    href: string | null,
    text: string,
    area: number, // width x height
    visible: boolean,
}

export interface AnchorElementsExtractResult {
    elements: AnchorElement[],
    /**
     * Number of elements in the page (visible + invisible)
     */
    elementCount: number,
    /**
     * Number of elements in the page (visible only)
     */
    visibleElementCount: number,
    scrollWidth: number,
    scrollHeight: number,
}
