package com.sdws.ImageProcessingSpring.models.testAll;

import com.sdws.ImageProcessingSpring.models.density.DensityResult;
import com.sdws.ImageProcessingSpring.models.negativespace.NegativeSpaceResult;
import com.sdws.ImageProcessingSpring.models.symmetry.SymmetryResult;

public class TestAllResult {
    private SymmetryResult symmetryResult ;
    private DensityResult densityResult;
    private NegativeSpaceResult negativeSpaceResult;

    public TestAllResult() {
    }

    public TestAllResult(SymmetryResult symmetryResult, DensityResult densityResult , NegativeSpaceResult negativeSpaceResult) {
        this.symmetryResult = symmetryResult;
        this.densityResult = densityResult;
        this.negativeSpaceResult = negativeSpaceResult ;
    }






    public SymmetryResult getSymmetryResult() {
        return symmetryResult;
    }

    public void setSymmetryResult(SymmetryResult symmetryResult) {
        this.symmetryResult = symmetryResult;
    }

    public DensityResult getNegativeSpaceAndDensityResult() {
        return densityResult;
    }

    public void setNegativeSpaceAndDensityResult(DensityResult densityResult) {
        this.densityResult = densityResult;
    }
}
