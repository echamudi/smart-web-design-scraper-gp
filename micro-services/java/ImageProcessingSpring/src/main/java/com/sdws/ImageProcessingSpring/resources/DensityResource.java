package com.sdws.ImageProcessingSpring.resources;

import com.sdws.ImageProcessingSpring.models.density.DensityCallBody;
import com.sdws.ImageProcessingSpring.models.density.NegativeSpaceAndDensityResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.awt.image.BufferedImage;
import java.util.*;

import static com.sdws.ImageProcessingSpring.utils.ColorsUtils.getRGBArr;
import static com.sdws.ImageProcessingSpring.utils.ImageUtils.decodeImage;

@RestController



@RequestMapping("/density")
public class DensityResource {


    @PostMapping("/test")
    public NegativeSpaceAndDensityResult checkDensity(@RequestBody DensityCallBody img) {

            BufferedImage image = decodeImage(img.getImg());

            NegativeSpaceAndDensityResult callBack = checkDensity(image);


        return callBack;
    }



    public static NegativeSpaceAndDensityResult checkDensity(BufferedImage buffImg)  {
        Map colorsCounts = new HashMap();
        // looping through the image...
        System.out.println(buffImg.getHeight()  + " * " + buffImg.getWidth()) ;
        for (int y = 0; y < buffImg.getHeight(); y++) {
            for (int x = 0; x < buffImg.getWidth(); x++) {
                int  rgb   = buffImg.getRGB(x, y);
                int[] rbgArr = getRGBArr(rgb);

                Integer counter = (Integer) colorsCounts.get(rgb);
                if(counter == null) {
                    // we don't have a counter for the color yet... so we set it's counter to zero...
                    counter = 0 ;
                }
                // add the pixel found to the color's , and update the map with the new count of the color ...
                counter++ ;
                colorsCounts.put(rgb, counter) ;
            }
        }
        // getting the most common color...
        int mostCommonColor = getMostCommonColor(colorsCounts) ;
        System.out.println( " most common color : " + mostCommonColor);
        int  mostCommonColorCount = (int)colorsCounts.get(mostCommonColor) ;
        System.out.println("most common color count : " +mostCommonColorCount ) ;
        //  getting percentage of the dominant color in the rest of the image ...
        int allPixels =  buffImg.getWidth() * buffImg.getHeight() ;
        System.out.println("all pixels ::> " + allPixels) ;
        double percentageOfDominantColor = ((double)mostCommonColorCount / (double)allPixels) *100 ;
        double percentageOfNegativeSpace = 100 -  percentageOfDominantColor  ;
        System.out.println("percentage of Density ::>  "+percentageOfNegativeSpace);
        System.out.println( "percentage of negative Space : " + percentageOfDominantColor) ;
 //        construct the callback and return it...


        return new NegativeSpaceAndDensityResult();
//        return String.valueOf(percentageOfDominantColor);
    }







    private static int getMostCommonColor(Map map) {
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
        System.out.println("list size ::: " + list.size()) ;
        Map.Entry me = (Map.Entry )list.get(list.size()-1);
//        int[] rgb = ColorsUtils.getRGBArr((Integer) me.getKey());
        // return pixel...
        System.out.println("most comomn color key ::> " + (int)me.getKey()) ;
        return (int)me.getKey() ;
    }








}