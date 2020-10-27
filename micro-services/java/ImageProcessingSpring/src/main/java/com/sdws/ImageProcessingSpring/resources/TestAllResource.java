package com.sdws.ImageProcessingSpring.resources;


import com.sdws.ImageProcessingSpring.models.negativespace.NegativeSpaceResult;
import com.sdws.ImageProcessingSpring.models.testAll.TestAllCallBody;
import com.sdws.ImageProcessingSpring.models.testAll.TestAllResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "*")
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
        return new TestAllResult(symmetry.checkSymmetry(bufImage),density.checkDensity(bufImage),negativeSpace.checkNegativeSpace(bufImage));
    }









}
