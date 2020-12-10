// DATA EXTRACTOR

import { ComponentPosition } from "./types";

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

export interface ElementComponent {
    position: ComponentPosition,

    area: number, // width x height
    visible: boolean,
};

export interface ElementDetectionExtractResult {
    components: ElementComponent[],
    /**
     * Number of components in the page (visible + invisible)
     */
    componentCount: number,
    /**
     * Number of components in the page (visible only)
     */
    visibleComponentCount: number,
    scrollWidth: number,
    scrollHeight: number,
}

// text-detection

export interface TextComponent {
    position: ComponentPosition,

    fontType: string,
    textSize: string,
    color: string,
    backgroundColor: string,
    fontWeight: string,
    visible: boolean
}

export interface TextDetectionExtractResult {
    components: TextComponent[],
    /**
     * Number of components in the page (visible + invisible)
     */
    componentCount: number,
    /**
     * Number of components in the page (visible only)
     */
    visibleComponentCount: number,
    scrollWidth: number,
    scrollHeight: number,
}

// image-detection

export interface ImageComponent {
    position: ComponentPosition,

    url: string,
    tagName: string,
    area: number, // width x height
    visible: boolean,
}

export interface ImageDetectionExtractResult {
    components: ImageComponent[],
    /**
     * Number of components in the page (visible + invisible)
     */
    componentCount: number,
    /**
     * Number of components in the page (visible only)
     */
    visibleComponentCount: number,
    scrollWidth: number,
    scrollHeight: number,
}

// video-detection

export interface VideoComponent {
    position: ComponentPosition,

    url: string,
    tagName: string,
    area: number, // width x height
    visible: boolean,
}

export interface VideoDetectionExtractResult {
    components: VideoComponent[],
    /**
     * Number of components in the page (visible + invisible)
     */
    componentCount: number,
    /**
     * Number of components in the page (visible only)
     */
    visibleComponentCount: number,
    scrollWidth: number,
    scrollHeight: number,
}

// anchor-detection

export interface AnchorComponent {
    position: ComponentPosition,

    href: string | null,
    text: string,
    area: number, // width x height
    visible: boolean,
}

export interface AnchorDetectionExtractResult {
    components: AnchorComponent[],
    /**
     * Number of components in the page (visible + invisible)
     */
    componentCount: number,
    /**
     * Number of components in the page (visible only)
     */
    visibleComponentCount: number,
    scrollWidth: number,
    scrollHeight: number,
}
