package com.sdws.ImageProcessingSpring.models;

public class SymmetryResult {

    private SymmetryHorizontalResult horizontalSymmetry;
    private SymmetryVerticalResult verticalSymmetry;

    public SymmetryResult(SymmetryHorizontalResult horizontalSymmetry, SymmetryVerticalResult verticalSymmetry) {
        this.horizontalSymmetry = horizontalSymmetry;
        this.verticalSymmetry = verticalSymmetry;
    }

    public SymmetryVerticalResult getVerticalSymmetry() {
        return verticalSymmetry;
    }

    public void setVerticalSymmetry(SymmetryVerticalResult verticalSymmetry) {
        this.verticalSymmetry = verticalSymmetry;
    }

    public SymmetryHorizontalResult getHorizontalSymmetry() {
        return horizontalSymmetry;
    }

    public void setHorizontalSymmetry(SymmetryHorizontalResult horizontalSymmetry) {
        this.horizontalSymmetry = horizontalSymmetry;
    }
}
