package com.sdws.ImageProcessingSpring.resources;


import com.sdws.ImageProcessingSpring.models.testAll.TestAllCallBody;
import com.sdws.ImageProcessingSpring.models.testAll.TestAllResult;
import com.sdws.ImageProcessingSpring.utils.ImageUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.awt.image.BufferedImage;


@RestController
@RequestMapping("/test")
public class TestAllResource {

    @PostMapping("/all")
    private TestAllResult testAll(@RequestBody TestAllCallBody callBody) {
        /*
        * Symmetry Result ,
        * negativeSpaceAndDensity
        * */
        return testAll(callBody.getImg()) ;
    }



    private TestAllResult testAll(String bufImage) {
        SymmetryResource symmetry = new SymmetryResource() ;
        NegativeSpaceAndDensityResource negativeAndDensity = new NegativeSpaceAndDensityResource();

        return new TestAllResult(symmetry.checkSymmetry(bufImage),negativeAndDensity.checkDensity(bufImage));
    }









}
