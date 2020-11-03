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


@RestController
@RequestMapping("/balance")
@CrossOrigin(origins = "*") // Temporarily allowing all origins
public class BalanceTestResource {


    @PostMapping("/test")
    public BalanceResult balanceTest(@RequestBody BalanceCallBody body){
        System.loadLibrary("opencv_java440");
        System.loadLibrary( Core.NATIVE_LIBRARY_NAME );
        System.out.println("balance route...");
        balanceTest( ImageUtils.decodeImage(body.getImg()));
        return new BalanceResult("is working...") ;
    }


    private BalanceResult balanceTest(BufferedImage buffImage) {
        try {
            Mat source = ImageUtils.img2Mat(buffImage);
            Mat destination = new Mat();
            // convert to black and white ...
            Imgproc.cvtColor(source,destination , Imgproc.COLOR_RGB2GRAY);
            // convert the image to black and white does (8 bit)...
//            Imgproc.Canny(destination,destination,50,50);
            Imgproc.Canny(destination,destination,50 ,255);
            // apply gaussian blur to smoothen lines of dots...
            Imgproc.GaussianBlur(destination,destination ,new Size(5,5),5);

            // finding the contours...
            List<MatOfPoint> contours = new ArrayList<>();
            Imgproc.findContours(destination,contours,new Mat(),Imgproc.RETR_LIST,Imgproc.CHAIN_APPROX_SIMPLE);
            System.out.println("contours size ==> " + contours.size()) ;
            List<MatOfPoint> squares = new ArrayList<>();
            int countRectangles = 0 ;
            for(MatOfPoint contour : contours) {
                // area of th contour...
                double area = Imgproc.contourArea(contour);
                System.out.println("area of the contour ==> " + area) ;
                // convert to MatOfPoints2f  to get approximate polygon later from the contour...
                MatOfPoint2f newMat = new MatOfPoint2f(contour.toArray());

                MatOfPoint2f approxCurve = new MatOfPoint2f();
                int contourSize = (int)contour.total() ;

                Imgproc.approxPolyDP(newMat,approxCurve,contourSize*0.05,true);

                // check if the polygon has only 4 lines...
                System.out.println("number of lines ==>"+approxCurve.total()) ;
                if(approxCurve.total() == 4) {
                    countRectangles++ ;



                }




            }
            System.out.println("rectangles detected ==> " +   countRectangles) ;







        }catch(Exception e) {
            e.printStackTrace();
        }
        return null ;
    }


    private static double getAngle(Point pt1, Point pt2, Point pt0)
    {
        double dx1 = pt1.x - pt0.x;
        double dy1 = pt1.y - pt0.y;
        double dx2 = pt2.x - pt0.x;
        double dy2 = pt2.y - pt0.y;
        return (dx1*dx2 + dy1*dy2)/Math.sqrt((dx1*dx1 + dy1*dy1)*(dx2*dx2 + dy2*dy2) + 1e-10);
    }








}
