package com.sdws.ImageProcessingSpring.resources;


import com.sdws.ImageProcessingSpring.models.balance.BalanceCallBody;
import com.sdws.ImageProcessingSpring.models.balance.BalanceResult;
import com.sdws.ImageProcessingSpring.utils.ColorsUtils;
import com.sdws.ImageProcessingSpring.utils.ImageUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.awt.image.BufferedImage;
import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.Point;
import org.opencv.core.Scalar;
import org.opencv.core.Size;
import org.opencv.imgcodecs.*;
import org.opencv.imgproc.Imgproc;


@RestController
@RequestMapping("/balance")
public class BalanceTestResource {


    @PostMapping("/test")
    public BalanceResult balanceTest(@RequestBody BalanceCallBody body){

        System.out.println("balance route...");

        return new BalanceResult() ;
    }


    private BalanceResult balanceTest(BufferedImage buffImage) {

       // preparing the image before using detection tools...
       int backgroundColor = ColorsUtils.getMostCommonColor(ImageUtils.getColorCounts(buffImage));
       BufferedImage imageWithWhiteBackground = ImageUtils.setAllBackgroundToWhite(buffImage , backgroundColor);

        // convert to Mat ...
        Mat source = ImageUtils.img2Mat(imageWithWhiteBackground);
//        // a place to hold the greyed out version of the image...
//        Mat greyedOutImage = new Mat(source.rows(),source.cols(),source.type());
//        // greying out the image and storing it...
//        Imgproc.cvtColor(source,greyedOutImage,Imgproc.COLOR_RGB2GRAY);
//        // equalizing the histogram of the image ... (improving the contrast of the image)
////        Imgproc.equalizeHist(greyedOutImage,greyedOutImage);
//        // blurring the image ...
////        Imgproc.GaussianBlur(greyedOutImage, greyedOutImage, new Size(5, 5), 0, 0, Core.BORDER_DEFAULT);
//
////        Imgproc.Canny(greyedOutImage,);







        return null ;
    }











}
