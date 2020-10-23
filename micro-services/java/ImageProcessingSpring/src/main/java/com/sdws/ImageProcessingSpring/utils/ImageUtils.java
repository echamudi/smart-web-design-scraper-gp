package com.sdws.ImageProcessingSpring.utils;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import org.opencv.core.CvType;
import org.opencv.core.Mat;

import static com.sdws.ImageProcessingSpring.utils.ColorsUtils.getRGBArr;

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






}
