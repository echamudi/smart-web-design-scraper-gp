package com.sdws.ImageProcessingSpring.utils;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

import com.sdws.ImageProcessingSpring.models.shapdetection.Points;
import com.sdws.ImageProcessingSpring.models.shapdetection.Square;
import org.opencv.core.*;
import org.opencv.imgproc.Imgproc;

import static com.sdws.ImageProcessingSpring.utils.ColorsUtils.getRGBArr;
import static org.opencv.imgproc.Imgproc.RETR_EXTERNAL;

public class ImageUtils {
    //converting image from base64 text to Buffered Image
    public static BufferedImage decodeImage(String img) {
        BufferedImage buffimg = null ;
        try {
            String imageDataBytes = img.substring(img.indexOf(",")+1);
            Base64.Decoder decoder = Base64.getDecoder() ;
            InputStream stream = new ByteArrayInputStream(decoder.decode(imageDataBytes.getBytes()));
            buffimg = ImageIO.read(stream) ;

        } catch (IOException e) {
            e.printStackTrace();
        }
        return buffimg ;
    }

    //converting image from BufferedImage to Mat from opencv...
    public static Mat img2Mat(BufferedImage image) {
        image = convertTo3ByteBGRType(image);
        byte[] data = ((DataBufferByte) image.getRaster().getDataBuffer()).getData();
        Mat mat = new Mat(image.getHeight(), image.getWidth(), CvType.CV_8UC3);
        mat.put(0, 0, data);
        return mat;
    }

    private static BufferedImage convertTo3ByteBGRType(BufferedImage image) {
        BufferedImage convertedImage = new BufferedImage(image.getWidth(), image.getHeight(),
                BufferedImage.TYPE_3BYTE_BGR);
        convertedImage.getGraphics().drawImage(image, 0, 0, null);
        return convertedImage;
    }


    public static BufferedImage setAllBackgroundToWhite(BufferedImage image , int backgroundColor) {
        for(int y = 0; y < image.getHeight(); y++) {
            for(int x = 0; x < image.getWidth(); x++) {
                if(image.getRGB(x, y) == backgroundColor) {
                    image.setRGB(x,y,0);
                }
            }
        }
        return image ;
    }



    //count all the colors in an image ...
    public static Map getColorCounts(BufferedImage buffImg) {
        Map colorsCounts = new HashMap();
        // looping through the image...
//        System.out.println(buffImg.getHeight()  + " * " + buffImg.getWidth()) ;
        for (int y = 0; y < buffImg.getHeight(); y++) {
            for (int x = 0; x < buffImg.getWidth(); x++) {
                int  rgb   = buffImg.getRGB(x, y);
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

    return colorsCounts ;
    }


    public static ArrayList<Square> shapeDetection(Mat source) {
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
        ArrayList<Square> result = new ArrayList();
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
                    // points...
                    hulls.add(tmp) ;
                    Point[] points = approx.toArray() ;
                    ArrayList<Points> p = new ArrayList<Points>();
                    for (int i = 0 ; i < points.length ; i++){
                        p.add(new Points(points[i].x,points[i].y));
                    }
                    result.add(new Square(p , Imgproc.contourArea(approx)));
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
        // System.out.println(squares.get(0).toArray()[0].toString()) ;
        return result ;
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
