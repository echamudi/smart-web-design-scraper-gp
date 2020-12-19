package com.sdws.ImageProcessingSpring.resources;

import com.sdws.ImageProcessingSpring.models.shapdetection.ShapeDetectionCallBody;
import com.sdws.ImageProcessingSpring.models.shapdetection.DetectedObject;
import com.sdws.ImageProcessingSpring.models.shapdetection.ShapeDetectionResult;
import com.sdws.ImageProcessingSpring.utils.ImageUtils;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;


@RestController
@RequestMapping("/shapes")
@CrossOrigin(origins = "*") // Temporarily allowing all origins
public class ShapeDetectionResource {


    @PostMapping("/detect")
    public ShapeDetectionResult detectShapes(@RequestBody ShapeDetectionCallBody body){
//        System.loadLibrary("opencv_java440");
//        System.loadLibrary( Core.NATIVE_LIBRARY_NAME );

//        Mat imageMatrix  = ImageUtils.img2Mat(ImageUtils.decodeImage(body.getImg()));
        return shapeDetection(body.getImg());
//    return "working...";
    }
    public ShapeDetectionResult shapeDetection(String image) {
        return new ShapeDetectionResult(ImageUtils.shapeDetection(ImageUtils.img2Mat(ImageUtils.decodeImage(image))));
    }










}
