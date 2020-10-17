import { Palette } from "node-vibrant/lib/color";

// factor id: symmetry

export interface SymmetryConfig {
    /**
     * 0-100
     */
    acceptablePercentage: number;
}

export interface SymmetryResult {
    visitedPixels: number,

    /**
     * Exact top-bottom symmetry pixels count
     */
    tbExactSymmetricalPixels: number,

    /**
     * Exact left-right symmetry pixels count
     */
    lrExactSymmetricalPixels: number
}

// factor id: pictures

export interface PicturesConfig {
    /**
     * Minimum picture area (px^2)
     */
    acceptableThreshold: number;
}

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
     * all font stacks
     */
    stacks: string[];

    /**
     * The first font of each font stack in allFonts
     */
    usedFonts: string[];
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
    // totalElements: number;

    /**
     * total characters
     */
    totalCharacters: number;

    /**
     * total characters with font size under threshold
     */
    // totalSmallCharacters: number;

    /**
     * Characters counter for each font size
     */
    textSizeMap: Record<number, number>;

    /**
     * Score
     */
    // score: number;
}

// factor id: color-harmony

export interface ColorHarmonyConfig {
    /**
     * In percentage (0-100)
     */
    vibrantMaxAreaPercentage: number;
}

export interface ColorHarmonyResult {
    vibrant: Palette | undefined;
    totalPixels: number;
    vibrantPixelCount: number;
}

export type ColorHarmonyPallete = Palette;

// factor id: element-count

export interface ElementCountResult {
    count: number;

    /**
     * Count of each tag name
     */
    list: Record<string, number>;
}

// factor id: browser-info

export interface BrowserInfoResult {
    url: string,
    userAgent: string;
    viewportWidth: number;
    viewportHeight: number;
}
