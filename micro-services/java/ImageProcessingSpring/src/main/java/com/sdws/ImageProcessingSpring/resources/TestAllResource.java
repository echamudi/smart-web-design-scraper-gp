package com.sdws.ImageProcessingSpring.resources;


import com.sdws.ImageProcessingSpring.models.negativespace.NegativeSpaceResult;
import com.sdws.ImageProcessingSpring.models.testAll.TestAllCallBody;
import com.sdws.ImageProcessingSpring.models.testAll.TestAllResult;
import com.sdws.ImageProcessingSpring.utils.ImageUtils;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "*") // Temporarily allowing all origins
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
        DensityResource density = new DensityResource();
        NegativeSpaceResource negativeSpace = new NegativeSpaceResource();
        ShapeDetectionResource shapeDetection = new ShapeDetectionResource() ;


        return new TestAllResult(symmetry.checkSymmetry(bufImage),density.checkDensity(bufImage),negativeSpace.checkNegativeSpace(bufImage),shapeDetection.shapeDetection(bufImage));
    }









}
