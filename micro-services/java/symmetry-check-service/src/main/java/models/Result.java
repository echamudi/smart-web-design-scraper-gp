package models;

public class Result {

    private double verticalSymmetryPercentage ;
    private double horizontalSymmetryPercentage ;

    public Result(double verticalSymmetryPercentage, double horizontalSymmetryPercentage) {
        this.verticalSymmetryPercentage = verticalSymmetryPercentage;
        this.horizontalSymmetryPercentage = horizontalSymmetryPercentage;
    }

    public double getVerticalSymmetryPercentage() {
        return verticalSymmetryPercentage;
    }

    public void setVerticalSymmetryPercentage(double verticalSymmetryPercentage) {
        this.verticalSymmetryPercentage = verticalSymmetryPercentage;
    }

    public double getHorizontalSymmetryPercentage() {
        return horizontalSymmetryPercentage;
    }

    public void setHorizontalSymmetryPercentage(double horizontalSymmetryPercentage) {
        this.horizontalSymmetryPercentage = horizontalSymmetryPercentage;
    }
}
