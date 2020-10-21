package com.sdws.ImageProcessingSpring.models.density;

public class NegativeSpaceAndDensityResult {

    private double negativeSpacePercentage  ;
    private double densityPercentage ;
    private int allPixels ;
    private int backgroundColor;
    private int backgroundPixels ;


    public NegativeSpaceAndDensityResult() {

    }


    public NegativeSpaceAndDensityResult(double negativeSpacePercentage,
                                         double densityPercentage,
                                         int allPixels,
                                         int backgroundColor,
                                         int backgroundPixels) {
        this.negativeSpacePercentage = negativeSpacePercentage;
        this.densityPercentage = densityPercentage;
        this.allPixels = allPixels;
        this.backgroundColor = backgroundColor;
        this.backgroundPixels = backgroundPixels;
    }

    public double getNegativeSpacePercentage() {
        return negativeSpacePercentage;
    }

    public void setNegativeSpacePercentage(double negativeSpacePercentage) {
        this.negativeSpacePercentage = negativeSpacePercentage;
    }

    public double getDensityPercentage() {
        return densityPercentage;
    }

    public void setDensityPercentage(double densityPercentage) {
        this.densityPercentage = densityPercentage;
    }

    public int getAllPixels() {
        return allPixels;
    }

    public void setAllPixels(int allPixels) {
        this.allPixels = allPixels;
    }

    public int getBackgroundColor() {
        return backgroundColor;
    }

    public void setBackgroundColor(int backgroundColor) {
        this.backgroundColor = backgroundColor;
    }

    public int getBackgroundPixels() {
        return backgroundPixels;
    }

    public void setBackgroundPixels(int backgroundPixels) {
        this.backgroundPixels = backgroundPixels;
    }
}
