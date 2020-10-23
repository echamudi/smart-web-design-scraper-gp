package com.sdws.ImageProcessingSpring.utils;

import java.awt.*;
import java.util.*;
import java.util.List;

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

    public static int getMostCommonColor(Map map) {
        List list = new LinkedList<>(map.entrySet());
        // sorting the map in reverse order ...
        Collections.sort(list, new Comparator<>() {
            @Override
            public int compare(Object o1, Object o2) {
                return ((Comparable) ((Map.Entry) (o1)).getValue())
                        .compareTo(((Map.Entry) (o2)).getValue());
            }
        });
        // return the last item in the map (which is the most used element);
//        System.out.println("list size ::: " + list.size()) ;
        Map.Entry me = (Map.Entry )list.get(list.size()-1);
//        int[] rgb = ColorsUtils.getRGBArr((Integer) me.getKey());
        // return pixel...
//        System.out.println("most comomn color key ::> " + (int)me.getKey()) ;
        return (int)me.getKey() ;
    }









}
