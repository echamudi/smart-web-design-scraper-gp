export interface JavaResponse {
    symmetryResult?: {
        horizontalSymmetry?: {
            /**
             * 0-100
             */
            percentage?: number,
            allVisitedPixels?: number,
            symmetricalPixels?: number,
            nonSymmetricalPixels?: number
        },
        verticalSymmetry?: {
            /**
             * 0-100
             */
            percentage?: number,
            allVisitedPixels?: number,
            symmetricalPixels?: number,
            nonSymmetricalPixels?: number
        }
    },
    densityResult?: {
        /**
         * 0-100
         */
        densityPercentage?: number,
        allPixels?: number,
        backgroundColor?: number,
        backgroundPixels?: number
    },
    negativeSpaceResult?: {
        /**
         * 0-100 (100 - densityPercentage)
         */
        negativeSpacePercentage?: number,
        allPixels?: number,
        backgroundColor?: number,
        backgroundPixels?: number
    },
    shapeDetectionResult?: Array<{
        points?: [
            {x?: number, y?: number},
            {x?: number, y?: number},
            {x?: number, y?: number},
            {x?: number, y?: number}
        ],
        area?: number
    }>
}
