package com.sdws.ImageProcessingSpring.models.symmetry;

public class SymmetryHorizontalResult {

    private double percentage ;
    private int allVisitedPixels ;
    private int symmetricalPixels ;
    private int nonSymmetricalPixels ;


    public SymmetryHorizontalResult(double percentage, int allVisitedPixels, int symmetricalPixels, int nonSymmetricalPixels) {
        this.percentage = percentage;
        this.allVisitedPixels = allVisitedPixels;
        this.symmetricalPixels = symmetricalPixels;
        this.nonSymmetricalPixels = nonSymmetricalPixels;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }

    public int getAllVisitedPixels() {
        return allVisitedPixels;
    }

    public void setAllVisitedPixels(int allVisitedPixels) {
        this.allVisitedPixels = allVisitedPixels;
    }

    public int getSymmetricalPixels() {
        return symmetricalPixels;
    }

    public void setSymmetricalPixels(int symmetricalPixels) {
        this.symmetricalPixels = symmetricalPixels;
    }

    public int getNonSymmetricalPixels() {
        return nonSymmetricalPixels;
    }

    public void setNonSymmetricalPixels(int nonSymmetricalPixels) {
        this.nonSymmetricalPixels = nonSymmetricalPixels;
    }
}
