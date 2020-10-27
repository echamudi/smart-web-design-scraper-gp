package com.sdws.ImageProcessingSpring.models.negativespace;

public class NegativeSpaceResult {

    private double negativeSpacePercentage  ;
    private int allPixels ;
    private int backgroundColor;
    private int backgroundPixels ;


    public NegativeSpaceResult(NegativeSpaceResult negativeSpaceResult) {

    }


    public NegativeSpaceResult(double negativeSpacePercentage,
                               int allPixels,
                               int backgroundColor,
                               int backgroundPixels) {
        this.negativeSpacePercentage = negativeSpacePercentage;
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
