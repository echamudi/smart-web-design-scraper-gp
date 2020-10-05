package com.smartwebdesignscraper.symmetrycheckservice.resources;


import models.Result;
import models.SymmetryCallBody;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.Buffer;
import java.util.Base64;

@RestController
@RequestMapping("/symmetry")
public class SymmetryResource {


    @PostMapping("/test")
    public Result checkSymmetry(@RequestBody SymmetryCallBody img) {
        // decoding the image...
        // TODO (1) find a solution for too long String problem of tombcat...
        // TODO (2) decode the image to a BufferedImage and set it to the following variable ...
        BufferedImage buffimg = decodeImage(img.getImg());


        // dummy for later...
        return new Result(horizontalSymmetryTest(buffimg),verticalSymmetryTest(buffimg)) ;
    }

    private static double howDiff(Color c1 , Color c2) {
        double dis = Math.sqrt(Math.pow(c2.getRed()-c1.getRed(),2)+Math.pow(c2.getGreen()-c1.getGreen(),2)+ Math.pow(c2.getBlue()-c1.getBlue(),2));


        return (dis / Math.sqrt(Math.pow(255,2)+Math.pow(255,2)+Math.pow(255,2))) * 100 ;
    }


    private static double verticalSymmetryTest(BufferedImage buffImg)  {
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

                if (howDiff(c1,c2) >= 2) {
                    nonSymmetrical++ ;
                } else {
                    Symmetrical++ ;
//                    buffImg.setRGB(j,i,0);

                }
            }
        }
        System.out.println("all visited : " +allVisited) ;
        System.out.println( "mv symmetric = " + Symmetrical);
        System.out.println( "mv No symmetric = " + nonSymmetrical);
//        ImageIO.write(buffImg,"PNG",new File("/home/tatsujin/test-tralala.png"));
        return ((double)Symmetrical/(double)allVisited) * 100 ;
    }


    private  double horizontalSymmetryTest(BufferedImage img) {
        int rows = img.getWidth() ;
        int columns = img.getHeight() ;
        int HorizontalnonSymmetricalPixel =  0 ;
        int HorizontalsymmetricalPixel = 0 ;
        int allpixelsVisit = 0 ;
        for(int i = 0 , k = rows - 1 ; i< rows / 2 ; i++ , k--) {

            for(int j =0 ; j < columns  ; j++ ) {
                allpixelsVisit++;
                System.out.println("i = "+ i +" j = "+j + " || " +"k = "+ k + " j = " + j );

                Color c1 = new Color(img.getRGB(i,j)) ;
                Color c2 = new Color(img.getRGB(k,j)) ;
                if(howDiff(c1,c2) >= 2 ) {
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
        return ((double)HorizontalsymmetricalPixel/(double)allpixelsVisit ) *100 ;
    }



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


}
