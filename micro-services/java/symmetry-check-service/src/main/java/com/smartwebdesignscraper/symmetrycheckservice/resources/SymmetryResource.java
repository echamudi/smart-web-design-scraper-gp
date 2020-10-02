package com.smartwebdesignscraper.symmetrycheckservice.resources;


import models.Result;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;

@RestController
@RequestMapping("/symmetry")
public class SymmetryResource {


    @RequestMapping("/{img}")
    public Result checkSymmetry(@PathVariable("img") String img) {

        // dummy for later...
        return new Result(51.2465,51461.24165) ;
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
