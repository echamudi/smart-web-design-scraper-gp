package com.sdws.ImageProcessingSpring.utils;

import java.awt.*;

public class ColorsUtils {


    public static double howDiff(Color c1 , Color c2) {
        double dis = Math.sqrt(Math.pow(c2.getRed()-c1.getRed(),2)+Math.pow(c2.getGreen()-c1.getGreen(),2)+ Math.pow(c2.getBlue()-c1.getBlue(),2));
        return (dis / Math.sqrt(Math.pow(255,2)+Math.pow(255,2)+Math.pow(255,2))) * 100 ;
    }

    // returns the array {red , green , Blue}
    public static int[] getRGBArr(int pixel) {
//        int alpha = (pixel >> 24 )
        Color color  = new Color(pixel);

        return new int[] {color.getRed(),color.getGreen(),color.getBlue()};
    }




}
