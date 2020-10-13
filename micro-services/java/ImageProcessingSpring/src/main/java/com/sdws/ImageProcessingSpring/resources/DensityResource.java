package com.sdws.ImageProcessingSpring.resources;

import com.sdws.ImageProcessingSpring.models.density.DensityCallBody;
import com.sdws.ImageProcessingSpring.utils.ColorsUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.opencv.core.Core ;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

import static com.sdws.ImageProcessingSpring.utils.ColorsUtils.getRGBArr;
import static com.sdws.ImageProcessingSpring.utils.ImageUtils.decodeImage;

@RestController



@RequestMapping("/density")
public class DensityResource {


    @PostMapping("/test")
    public String checkDensity(@RequestBody DensityCallBody img) {

        BufferedImage buffImg  = decodeImage(img.getImg());
        int height = buffImg.getWidth() ;
        int width = buffImg.getWidth();
        Map colorsCounts = new HashMap();
         // looping through the image...
        for(int i =0 ; i < width  ; i++) {
            for(int j = 0 ; j < height ; j++) {
                int rgb = buffImg.getRGB(i,j);
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


        return Core.VERSION;
    }


    private int  gettingMostCommonColor(Map map) {
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
        Map.Entry me = (Map.Entry )list.get(list.size()-1);
//        int[] rgb = ColorsUtils.getRGBArr((Integer) me.getKey());
        // return pixel...
        return (int)me.getKey() ;
    }








}