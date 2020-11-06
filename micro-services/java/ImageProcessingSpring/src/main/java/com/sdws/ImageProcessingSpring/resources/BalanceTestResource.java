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
        System.loadLibrary("opencv_java440");
        System.loadLibrary( Core.NATIVE_LIBRARY_NAME );
        System.out.println("balance route...");
        balanceTest( ImageUtils.decodeImage(body.getImg()));
        return new BalanceResult("is working...") ;
    }


    private BalanceResult balanceTest(BufferedImage buffImage) {
        return null ;
    }






    private static void shapeDetection(Mat source) {
        Mat grey = new Mat();
        Imgproc.cvtColor(source,grey,Imgproc.COLOR_BGR2GRAY);
//        Imgcodecs.imwrite("C:\\Users\\akumanotatsujin\\Pictures\\grey.png",grey);

        Imgproc.GaussianBlur(grey,grey,new Size(3,3),2,3);
//        Imgcodecs.imwrite("C:\\Users\\akumanotatsujin\\Pictures\\blur.png",grey);

        // Canny edge detection ...
        Imgproc.Canny(grey,grey,20,60,3,false);
//        Imgcodecs.imwrite("C:\\Users\\akumanotatsujin\\Pictures\\canny.png",grey);

        //Expand , connect edges ...
        Imgproc.dilate(grey,grey,new Mat(),new Point(-1,-1),3 ,1 , new Scalar(1));
//        Imgcodecs.imwrite("C:\\Users\\akumanotatsujin\\Pictures\\dilate.png",grey);


        List<MatOfPoint> contours = new ArrayList<>();

        Mat hierarchy = new Mat() ;


        Imgproc.findContours(grey,contours,hierarchy, RETR_EXTERNAL,Imgproc.CHAIN_APPROX_SIMPLE);


//        Imgcodecs.imwrite("C:\\Users\\akumanotatsujin\\Pictures\\hierarchy.png",hierarchy);
        System.out.println("contours : " + contours.size()) ;



        // find all squares...
        List<MatOfPoint> squares = new ArrayList<>();
        List<MatOfPoint> hulls  = new ArrayList<>();


        // Find quadrilateral fit of contour to convex hull
        MatOfInt hull = new MatOfInt();
        MatOfPoint2f approx = new MatOfPoint2f();
        approx.convertTo(approx,CvType.CV_32F);

        // looping through contours ...

        for(MatOfPoint contour : contours) {
            // convex hull of border ...
            Imgproc.convexHull(contour,hull);
            // calculating new outline points with convex hull ...
            Point[] contourPoints = contour.toArray();
            int[] indices = hull.toArray();
            List<Point> newPoints = new ArrayList<>();
            for(int index : indices) {
                newPoints.add(contourPoints[index]);
            }
            MatOfPoint2f contourHull = new MatOfPoint2f();
            contourHull.fromList(newPoints);

            // polygon fitting convex hull border (less accurate fitting at this point)
            Imgproc.approxPolyDP(contourHull,approx,Imgproc.arcLength(contourHull,true)*0.02,true);

            // a convex quadrilateral with an area greater than a certain threshold and with an angle close to right angle is selected ...
            MatOfPoint approxf1 = new MatOfPoint();
            approx.convertTo(approxf1,CvType.CV_32S);
            // area check is skipped cause i'm also after small squares ...
            if(approx.rows() == 4 && Imgproc.isContourConvex(approxf1)) {
                System.out.println("contour(square) area ==> " + Math.abs(Imgproc.contourArea(approx)) ) ;
                double maxCosine = 0 ;
                for(int j = 2 ; j  < 5 ; j++) {
                    double cosine = Math.abs(getAngle(approxf1.toArray()[j % 4], approxf1.toArray()[j - 2], approxf1.toArray()[j - 1]));
                    maxCosine = Math.max(maxCosine, cosine);
                }
                //the angle is about 72 degrees
                if(maxCosine <0.3) {
                    MatOfPoint tmp = new MatOfPoint();
                    contourHull.convertTo(tmp , CvType.CV_32S);
                    squares.add(approxf1);
                    hulls.add(tmp) ;
                }

            }
        }

        System.out.println("number of Accepted squares ==>" + squares.size()) ;
        // test getting the exact points...
        /*
        Point[] points = squares.get(0).toArray() ;
         for(int i =0 ; i<points.length ; i++) {
          System.out.println("Point (" + points[i].x +"," + points[i].y +")" ) ;
             }
*/


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
