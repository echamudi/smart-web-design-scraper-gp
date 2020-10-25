package com.sdws.ImageProcessingSpring.resources;


import com.sdws.ImageProcessingSpring.models.density.DensityResult;
import com.sdws.ImageProcessingSpring.models.negativespace.NegativeSpaceCallBody;
import com.sdws.ImageProcessingSpring.models.negativespace.NegativeSpaceResult;
import com.sdws.ImageProcessingSpring.utils.ColorsUtils;
import com.sdws.ImageProcessingSpring.utils.ImageUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.awt.image.BufferedImage;
import java.util.Map;


@RestController
@RequestMapping("/negative-space")
public class NegativeSpaceResource {


    @PostMapping("/test")
    public NegativeSpaceResult checkNegativeSpace(@RequestBody NegativeSpaceCallBody body) {

        return new NegativeSpaceResult(checkNegativeSpace(ImageUtils.decodeImage(body.getImg()))) ;
    }

    public NegativeSpaceResult checkNegativeSpace( String img) {

        return new NegativeSpaceResult(checkNegativeSpace(ImageUtils.decodeImage(img))) ;
    }

    private NegativeSpaceResult checkNegativeSpace(BufferedImage buffImg)  {
        Map colorsCounts = ImageUtils.getColorCounts(buffImg);
        // getting the most common color...
        int backgroundColor = ColorsUtils.getMostCommonColor(colorsCounts) ;
        int  backgroundPixels = (int)colorsCounts.get(backgroundColor) ;

        //  getting percentage of the dominant color in the rest of the image ...
        int allPixels =  buffImg.getWidth() * buffImg.getHeight() ;
        double percentageOfNegativeSpace = ((double)backgroundPixels / (double)allPixels) *100 ;

        //        construct the callback and return it...
        return new NegativeSpaceResult(percentageOfNegativeSpace,allPixels,backgroundColor,backgroundPixels);
    }

}
