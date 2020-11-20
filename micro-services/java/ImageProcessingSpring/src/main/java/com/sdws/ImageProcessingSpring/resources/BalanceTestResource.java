package com.sdws.ImageProcessingSpring.resources;


import com.sdws.ImageProcessingSpring.ImageProcessingSpringApplication;
import com.sdws.ImageProcessingSpring.models.balance.BalanceCallBody;
import com.sdws.ImageProcessingSpring.models.balance.BalanceResult;
import com.sdws.ImageProcessingSpring.utils.ColorsUtils;
import com.sdws.ImageProcessingSpring.utils.ImageUtils;
import jdk.jshell.ImportSnippet;
import org.opencv.core.*;
import org.springframework.web.bind.annotation.*;
import org.opencv.imgcodecs.Imgcodecs;
import java.awt.image.BufferedImage;
import java.util.ArrayList;
import java.util.List;

import org.opencv.imgcodecs.*;
import org.opencv.imgproc.Imgproc;

import static org.opencv.imgproc.Imgproc.RETR_EXTERNAL;


@RestController
@RequestMapping("/balance")
@CrossOrigin(origins = "*") // Temporarily allowing all origins
public class BalanceTestResource {


    @PostMapping("/test")
    public BalanceResult balanceTest(@RequestBody BalanceCallBody body){
//        System.loadLibrary("opencv_java440");
//        System.loadLibrary( Core.NATIVE_LIBRARY_NAME );
        System.out.println("balance route...");
      //  balanceTest( ImageUtils.decodeImage(body.getImg()));
        return new BalanceResult("is working...") ;
    }


    private BalanceResult balanceTest(BufferedImage buffImage) {
        return null ;
    }




























}
