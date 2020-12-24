package com.sdws.ImageProcessingSpring.models.balance;

public class BalanceResult {

    private int objectsOnTheLeftSideOfTheImage ;
    private int objectsOnTheRightSideOfTheImage ;
    private int objectsInTheMiddleOfTheImage  ;
    private double balanceScore ;

    public BalanceResult() {
    }

    public BalanceResult(int objectsOnTheLeftSideOfTheImage, int objectsOnTheRightSideOfTheImage, int objectsInTheMiddleOfTheImage, double balanceScore) {
        this.objectsOnTheLeftSideOfTheImage = objectsOnTheLeftSideOfTheImage;
        this.objectsOnTheRightSideOfTheImage = objectsOnTheRightSideOfTheImage;
        this.objectsInTheMiddleOfTheImage = objectsInTheMiddleOfTheImage;
        this.balanceScore = balanceScore;
    }

    public int getObjectsOnTheLeftSideOfTheImage() {
        return objectsOnTheLeftSideOfTheImage;
    }

    public void setObjectsOnTheLeftSideOfTheImage(int objectsOnTheLeftSideOfTheImage) {
        this.objectsOnTheLeftSideOfTheImage = objectsOnTheLeftSideOfTheImage;
    }

    public int getObjectsOnTheRightSideOfTheImage() {
        return objectsOnTheRightSideOfTheImage;
    }

    public void setObjectsOnTheRightSideOfTheImage(int objectsOnTheRightSideOfTheImage) {
        this.objectsOnTheRightSideOfTheImage = objectsOnTheRightSideOfTheImage;
    }

    public int getObjectsInTheMiddleOfTheImage() {
        return objectsInTheMiddleOfTheImage;
    }

    public void setObjectsInTheMiddleOfTheImage(int objectsInTheMiddleOfTheImage) {
        this.objectsInTheMiddleOfTheImage = objectsInTheMiddleOfTheImage;
    }

    public double getBalanceScore() {
        return balanceScore;
    }

    public void setBalanceScore(double balanceScore) {
        this.balanceScore = balanceScore;
    }
}
