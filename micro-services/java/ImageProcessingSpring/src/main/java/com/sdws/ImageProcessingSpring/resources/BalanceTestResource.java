package com.sdws.ImageProcessingSpring.resources;


import com.sdws.ImageProcessingSpring.models.balance.BalanceCallBody;
import com.sdws.ImageProcessingSpring.models.balance.BalanceResult;
import com.sdws.ImageProcessingSpring.utils.ColorsUtils;
import com.sdws.ImageProcessingSpring.utils.ImageUtils;
import org.opencv.core.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.awt.image.BufferedImage;
import java.util.ArrayList;

import org.opencv.imgcodecs.*;
import org.opencv.imgproc.Imgproc;


@RestController
@RequestMapping("/balance")
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
            // preparing the image before using detection tools...
            int backgroundColor = ColorsUtils.getMostCommonColor(ImageUtils.getColorCounts(buffImage));
            BufferedImage imageWithWhiteBackground = ImageUtils.setAllBackgroundToWhite(buffImage, backgroundColor);

            // convert to Mat ...
            Mat source = ImageUtils.img2Mat(imageWithWhiteBackground);
//        // a place to hold the greyed out version of the image...
            Mat greyedOutImage = new Mat(source.rows(), source.cols(), source.type());
//        // greying out the image and storing it...
            Imgproc.cvtColor(source, greyedOutImage, Imgproc.COLOR_RGB2GRAY);
//        // equalizing the histogram of the image ... (improving the contrast of the image)
////        Imgproc.equalizeHist(greyedOutImage,greyedOutImage);
//        // blurring the image ...
            Imgproc.GaussianBlur(greyedOutImage, greyedOutImage, new Size(5, 5), 0, 0, Core.BORDER_DEFAULT);
//
//        Imgproc.Canny(greyedOutImage,);
            Mat edges = new Mat();
            // Canny detect edges...
            Imgproc.Canny(greyedOutImage, edges, 100, 300);
            // Expnad , connect edges...
            Imgproc.dilate(greyedOutImage, greyedOutImage, new Mat(), new Point(-1, -1), 3, 1, new Scalar(1));
            // find contours
            ArrayList<MatOfPoint> contours = new ArrayList<>();
            Mat hierarchy = new Mat();
            Imgproc.findContours(greyedOutImage, contours, hierarchy, Imgproc.RETR_EXTERNAL, Imgproc.CHAIN_APPROX_SIMPLE);

            System.out.println(hierarchy);
            // find Squares ... or rectangles...
            ArrayList<MatOfPoint> rectangles = new ArrayList<>();
            MatOfInt hull = new MatOfInt();
            for (MatOfPoint contour : contours) {
                Imgproc.convexHull(contour, hull);
                // array of points for each of the detected contours...
                Point[] contourPoints = contour.toArray();
                int[] indices = hull.toArray();
                ArrayList<Point> newPoints = new ArrayList<>();
                for (int index : indices) {
                    newPoints.add(contourPoints[index]);
                }
                MatOfPoint2f contourHull = new MatOfPoint2f();
                MatOfPoint2f approx = new MatOfPoint2f();
                contourHull.fromList(newPoints);

                // polygon fitting convex hull borders (less accurate fitting at this point).
                Imgproc.approxPolyDP(contourHull, approx, Imgproc.arcLength(contourHull, true) * 0.02, true);

                // A convex quadrilateral with an area greater than a certain threshold and a quadrilateral with angles close to right angles is selected...
                MatOfPoint approxf1 = new MatOfPoint();
                approx.convertTo(approxf1, CvType.CV_32S);
                if (approx.rows() == 4 && Math.abs(Imgproc.contourArea(approx)) > 40000 && Imgproc.isContourConvex(approxf1)) {
                    // contour is a rectangle...
                    double maxCosine = 0;

                    for (int j = 2; j < 5; j++) {
                        double cosine = Math.abs(getAngle(approxf1.toArray()[j % 4], approxf1.toArray()[j - 2], approxf1.toArray()[j - 1]));
                        maxCosine = Math.max(maxCosine, cosine);
                    }
                    // the angle should be about 72 degrees...
                    if (maxCosine < 0.3) {
                        MatOfPoint tmp = new MatOfPoint();
                        contourHull.convertTo(tmp, CvType.CV_32S);
                        rectangles.add(approxf1);
//                    hulls.add() ;
                    }
                }


            }
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
