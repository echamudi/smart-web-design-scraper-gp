package com.sdws.ImageProcessingSpring.models.shapdetection;

import java.util.ArrayList;

public class Square {

    private ArrayList<Points> points ;
    private double area ;


    public Square(ArrayList<Points> points, double area) {
        this.points = points;
        this.area = area;
    }


    public ArrayList<Points> getPoints() {
        return points;
    }

    public void setPoints(ArrayList<Points> points) {
        this.points = points;
    }

    public double getArea() {
        return area;
    }

    public void setArea(double area) {
        this.area = area;
    }
}
