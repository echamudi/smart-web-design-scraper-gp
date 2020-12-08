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

export type ImageComponent = {
    position: ComponentPosition,

    url: string,
    tagName: string,
    area: number, // width x height
    visible: boolean,
};

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

export type VideoComponent = {
    position: ComponentPosition,

    url: string,
    tagName: string,
    area: number, // width x height
    visible: boolean,
};

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
