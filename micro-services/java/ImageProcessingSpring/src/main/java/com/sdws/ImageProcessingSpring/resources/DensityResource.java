package com.sdws.ImageProcessingSpring.resources;

import com.sdws.ImageProcessingSpring.models.DensityCallBody;
import com.sdws.ImageProcessingSpring.models.SymmetryCallBody;
import com.sdws.ImageProcessingSpring.models.SymmetryResult;
import org.opencv.osgi.OpenCVInterface;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.opencv.core.Core ;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;
import org.opencv.core.Core ;

@RestController



@RequestMapping("/density")
public class DensityResource {


    @PostMapping("/test")
    public String checkSymmetry(@RequestBody DensityCallBody img) {

        BufferedImage buffImg  = decodeImage(img.getImg());

        System.out.println(Core.VERSION);

        return Core.VERSION;
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
