package com.sdws.ImageProcessingSpring.resources;

import com.sdws.ImageProcessingSpring.models.density.DensityCallBody;
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
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

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
        return Core.VERSION;
    }











}
