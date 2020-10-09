import { Palette } from "ChromeExt/../node_modules/node-vibrant/lib/color";

// factor id: pictures

export interface PicturesResult {
    /**
     * Number of pictures in the page (visible + invisible)
     */
    allCount: number;
    /**
     * Number of pictures in the page (visible)
     */
    visibleCount: number;
    data: PictureData[];
}

export type PictureData = {
    url: string,
    tagName: string,
    width: number,
    height: number,
    area: number, // width x height
    x: number,
    y: number,
    visible: boolean,
};

// factor id: text-font-type

export interface TextFontTypeResult {
    /**
     * font stacks
     */
    fonts: string[];
}

// factor id: text-size

export interface TextSizeConfig {
    /**
     * Show or hide red markings on result screen
     */
    marking: boolean,

    /**
     * minimum font size threshold
     */
    minimumSize: number,
}

export interface TextSizeResult {
    /**
     * total elements with font size under threshold
     */
    totalElements: number;

    /**
     * total characters
     */
    totalCharacters: number;

    /**
     * total characters with font size under threshold
     */
    totalSmallCharacters: number;

    /**
     * Score
     */
    score: number;
}

// factor id: color-harmony

export interface ColorHarmonyResult {
    vibrant: Palette | undefined;
}

// factor id: element-count

export interface ElementCountResult {
    count: number;

    /**
     * Count of each tag name
     */
    list: Record<string, number>;
}
