package com.sdws.ImageProcessingSpring.models.density;

public class DensityResult {

    private double densityPercentage ;
    private int allPixels ;
    private int backgroundColor;
    private int backgroundPixels ;


    public DensityResult() {

    }


    public DensityResult(
                         double densityPercentage,
                         int allPixels,
                         int backgroundColor,
                         int backgroundPixels) {
        this.densityPercentage = densityPercentage;
        this.allPixels = allPixels;
        this.backgroundColor = backgroundColor;
        this.backgroundPixels = backgroundPixels;
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
