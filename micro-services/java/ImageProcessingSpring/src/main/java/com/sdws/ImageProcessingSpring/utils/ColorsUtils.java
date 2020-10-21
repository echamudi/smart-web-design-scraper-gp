package com.sdws.ImageProcessingSpring.utils;

import java.awt.*;

public class ColorsUtils {


    public static double howDiff(Color c1 , Color c2) {
        double dis = Math.sqrt(Math.pow(c2.getRed()-c1.getRed(),2)+Math.pow(c2.getGreen()-c1.getGreen(),2)+ Math.pow(c2.getBlue()-c1.getBlue(),2));
        return (dis / Math.sqrt(Math.pow(255,2)+Math.pow(255,2)+Math.pow(255,2))) * 100 ;
    }

    // returns the array {red , green , Blue}
    public static int[] getRGBArr(int pixel) {
        Color color  = new Color(pixel);
        return new int[] {color.getRed(),color.getGreen(),color.getBlue()};
    }


    // used to check if the color is black , white or one of the greys ...
    private boolean isGray(int[] rgbArr) {

        int rgDiff = rgbArr[0] - rgbArr[1];
        int rbDiff = rgbArr[0] - rgbArr[2];

        int tolerance = 10;

        if (rgDiff > tolerance || rgDiff < -tolerance)
            if (rbDiff > tolerance || rbDiff < -tolerance)
                return false;
        return true;
    }





}
