package com.sdws.ImageProcessingSpring.resources;

import com.sdws.ImageProcessingSpring.models.shapdetection.Points;
import com.sdws.ImageProcessingSpring.models.shapdetection.ShapeDetectionCallBody;
import com.sdws.ImageProcessingSpring.models.shapdetection.ShapeDetectionResult;
import com.sdws.ImageProcessingSpring.models.shapdetection.Square;
import com.sdws.ImageProcessingSpring.utils.ImageUtils;
import org.opencv.core.*;
import org.opencv.imgproc.Imgproc;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

import static org.opencv.imgproc.Imgproc.RETR_EXTERNAL;


@RestController
@RequestMapping("/shapes")
@CrossOrigin(origins = "*") // Temporarily allowing all origins
public class ShapeDetectionResource {


    @PostMapping("/detect")
    public ArrayList<Square> detectShapes(@RequestBody ShapeDetectionCallBody body){
//        System.loadLibrary("opencv_java440");
//        System.loadLibrary( Core.NATIVE_LIBRARY_NAME );

//        Mat imageMatrix  = ImageUtils.img2Mat(ImageUtils.decodeImage(body.getImg()));
        return shapeDetection(body.getImg());
//    return "working...";
    }
    public ArrayList<Square> shapeDetection(String image) {
        return ImageUtils.shapeDetection(ImageUtils.img2Mat(ImageUtils.decodeImage(image)));
    }










}
