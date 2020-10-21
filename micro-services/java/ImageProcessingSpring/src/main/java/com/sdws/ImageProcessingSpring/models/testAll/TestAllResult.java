package com.sdws.ImageProcessingSpring.models.testAll;

import com.sdws.ImageProcessingSpring.models.density.NegativeSpaceAndDensityResult;
import com.sdws.ImageProcessingSpring.models.symmetry.SymmetryResult;

public class TestAllResult {
    private SymmetryResult symmetryResult ;
    private NegativeSpaceAndDensityResult negativeSpaceAndDensityResult ;

    public TestAllResult() {
    }

    public TestAllResult(SymmetryResult symmetryResult, NegativeSpaceAndDensityResult negativeSpaceAndDensityResult) {
        this.symmetryResult = symmetryResult;
        this.negativeSpaceAndDensityResult = negativeSpaceAndDensityResult;
    }

    public SymmetryResult getSymmetryResult() {
        return symmetryResult;
    }

    public void setSymmetryResult(SymmetryResult symmetryResult) {
        this.symmetryResult = symmetryResult;
    }

    public NegativeSpaceAndDensityResult getNegativeSpaceAndDensityResult() {
        return negativeSpaceAndDensityResult;
    }

    public void setNegativeSpaceAndDensityResult(NegativeSpaceAndDensityResult negativeSpaceAndDensityResult) {
        this.negativeSpaceAndDensityResult = negativeSpaceAndDensityResult;
    }
}
