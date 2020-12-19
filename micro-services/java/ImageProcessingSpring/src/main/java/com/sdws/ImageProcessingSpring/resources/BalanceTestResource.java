package com.sdws.ImageProcessingSpring.resources;


import com.sdws.ImageProcessingSpring.models.balance.BalanceCallBody;
import com.sdws.ImageProcessingSpring.models.balance.BalanceResult;
import com.sdws.ImageProcessingSpring.models.shapdetection.Points;
import com.sdws.ImageProcessingSpring.models.shapdetection.DetectedObject;
import com.sdws.ImageProcessingSpring.utils.ImageUtils;
import org.springframework.web.bind.annotation.*;

import java.awt.image.BufferedImage;
import java.util.ArrayList;


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
//        return new BalanceResult("is working...") ;
    return balanceTest(ImageUtils.decodeImage(body.getImg())) ;
    }


    private BalanceResult balanceTest(BufferedImage buffImage) {
        // test all of the points of the objects if they're on the right side or the left side of the image
        // if x is more than the half of width then the point is on the right side...
        // if x is less than the half of the width then the point is on the left side...
        // if an object have two points at each side , it means that the object is in the middle of the image...

        int width = buffImage.getWidth();
        int height = buffImage.getHeight() ;

        ArrayList<DetectedObject> detectedObjects = ImageUtils.shapeDetection(ImageUtils.img2Mat(buffImage));


        int halfWidth = width / 2 ;
        int halfHeight=  height/ 2 ;


        // objects counts vertical ...
        int leftHandObjects = 0 ;
        int middleObjects  = 0 ;
        int rightHandObjects = 0 ;

        // objects counts horizontal...




        int numberofObjects = detectedObjects.size() ;
        int leftHandPoints = 0 ;
        int rightHandPoints = 0 ;

        for(int i = 0; i< detectedObjects.size() ; i++) {
             leftHandPoints = 0 ;
             rightHandPoints = 0 ;
            // loop through points of each object...
            ArrayList<Points> points = detectedObjects.get(i).getPoints() ;
            for (int j = 0 ; j <points.size() ; j++) {
                // vertical Axis check ...
                if (points.get(j).getX() > halfWidth) {
                // point is on the right half of the image...
                    rightHandPoints++;
                } else if (points.get(j).getX() < halfWidth) {
                // point is on the left half of the image...
                    leftHandPoints++ ;
                }else {
                // point is exactly on the middle (not counted for now)...
                System.out.println("point is exactly on the middle of the image...") ;
                }
                // horizontal Axis Check...




            }
            // the addition of the two variables leftHandPoints and rightHandPoints should be equal to the 4 points of the object...
            // if the object has more than three or more points on one side then the object is considered to be on that side...
            if (leftHandPoints >= 3) {
                // the object is on the left side...
                leftHandObjects++;
            }else if (rightHandPoints >= 3 ) {
                // the object is on the right side...
                rightHandObjects++;
            }else if(rightHandPoints == leftHandPoints) {
                // object is in the middle...
                middleObjects++;
            }else {
                // something is wrong...
                System.err.println("something went wrong ...") ;
                System.err.println("Debug :: "+"leftHandPoints = " + leftHandPoints + " | " +"middle objects = "+ middleObjects+"|" + "rightHandPoints = " + rightHandPoints) ;
            }
        }



        System.out.println("Debug :: "+"leftHandObjects = " + leftHandObjects + " | " +"middle objects = "+ middleObjects+"|" + "rightHandObjects = " + rightHandObjects) ;


        // scoring the image on objects on left and right sides of the image...
        // score balance ...
        // getting the ratio of of the objects on let
        int ratioBetweenRightAndLeftObjects = leftHandObjects / rightHandObjects  ;
        // if the result is more than 1  it means that the left hand side has more objects...
        // if the result is less than 1 it means that the right hand side has more objects...
        // if the ratio is 1 it means that the objects are identical on both left and right sides...
//        int ratioBetweenTopAndDown =  ;



        // the score is the ratio between left objects and right objects...
        return new BalanceResult(leftHandObjects,rightHandObjects,middleObjects,ratioBetweenRightAndLeftObjects) ;
    }




























}
