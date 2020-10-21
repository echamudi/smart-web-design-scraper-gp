package com.sdws.ImageProcessingSpring.resources;


import com.sdws.ImageProcessingSpring.models.symmetry.SymmetryHorizontalResult;
import com.sdws.ImageProcessingSpring.models.symmetry.SymmetryResult;
import com.sdws.ImageProcessingSpring.models.symmetry.SymmetryCallBody;
import com.sdws.ImageProcessingSpring.models.symmetry.SymmetryVerticalResult;
import com.sdws.ImageProcessingSpring.utils.ColorsUtils;
import com.sdws.ImageProcessingSpring.utils.ImageUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;

@RestController
@RequestMapping("/symmetry")
public class SymmetryResource {


    @PostMapping("/test")
    public SymmetryResult checkSymmetry(@RequestBody SymmetryCallBody img) {
        // decoding the image...
        BufferedImage buffimg = ImageUtils.decodeImage(img.getImg());
//            System.out.println("img : " + img) ;

        return new SymmetryResult(horizontalSymmetryTest(buffimg),verticalSymmetryTest(buffimg)) ;
    }


//horizontalSymmetryTest
    private static SymmetryVerticalResult verticalSymmetryTest(BufferedImage buffImg)  {
        int rows = buffImg.getWidth() ;
        int columns = buffImg.getHeight() ;
        int allVisited = 0 ;
        int nonSymmetrical = 0 ;
        int Symmetrical = 0 ;
//        System.out.println("width : " + rows + " height :" + columns ) ;

        for(int i = 0 , k = columns -1 ; i < columns /2 ; i ++ , k--  ) {

            for(int j = 0 ; j < rows   ; j++  ) {
                allVisited++ ;
//                System.out.println("j = "+j + " i = "+ i +" || " + " j = " + j+" k = "+ k  );

                Color c1 = new Color(buffImg.getRGB(j,i)) ;
                Color c2  = new Color(buffImg.getRGB(j,k)) ;

                if (ColorsUtils.howDiff(c1,c2) >= 2) {
                    nonSymmetrical++ ;
                } else {
                    Symmetrical++ ;
//                    buffImg.setRGB(j,i,0);
                }
            }
        }
//        System.out.println("all visited : " +allVisited) ;
//        System.out.println( "mv symmetric = " + Symmetrical);
//        System.out.println( "mv No symmetric = " + nonSymmetrical);
//        ImageIO.write(buffImg,"PNG",new File("/home/tatsujin/test-tralala.png"));
        double percentage = ((double)Symmetrical/(double)allVisited) * 100 ;

        return new SymmetryVerticalResult(percentage,allVisited , Symmetrical , nonSymmetrical ) ;
    }

//verticalSymmetryTest
    private  SymmetryHorizontalResult horizontalSymmetryTest(BufferedImage img) {
        int rows = img.getWidth() ;
        int columns = img.getHeight() ;
        int HorizontalnonSymmetricalPixel =  0 ;
        int HorizontalsymmetricalPixel = 0 ;
        int allpixelsVisit = 0 ;
        for(int i = 0 , k = rows - 1 ; i< rows / 2 ; i++ , k--) {

            for(int j =0 ; j < columns  ; j++ ) {
                allpixelsVisit++;
//                System.out.println("i = "+ i +" j = "+j + " || " +"k = "+ k + " j = " + j );

                Color c1 = new Color(img.getRGB(i,j)) ;
                Color c2 = new Color(img.getRGB(k,j)) ;
                if(ColorsUtils.howDiff(c1,c2) >= 2 ) {
                    HorizontalnonSymmetricalPixel++ ;
                } else{
                    HorizontalsymmetricalPixel++ ;
                }
            }
        }
/*
        System.out.println("width : " + rows + " height :" + columns ) ;
        System.out.println("all visited : " +allpixelsVisit) ;
        System.out.println( "m symmetric = " + HorizontalsymmetricalPixel);
        System.out.println( "m No symmetric = " + HorizontalnonSymmetricalPixel);
*/
        double percentage = ((double)HorizontalsymmetricalPixel/(double)allpixelsVisit ) *100 ;

        return new SymmetryHorizontalResult(percentage , allpixelsVisit,HorizontalsymmetricalPixel , HorizontalnonSymmetricalPixel);
    }



/*
    private BufferedImage decodeImage(String img) {
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
*/


}
