package com.sdws.ImageProcessingSpring.models.testAll;

import com.sdws.ImageProcessingSpring.models.density.DensityResult;
import com.sdws.ImageProcessingSpring.models.negativespace.NegativeSpaceResult;
import com.sdws.ImageProcessingSpring.models.shapdetection.DetectedObject;
import com.sdws.ImageProcessingSpring.models.symmetry.SymmetryResult;

import java.util.ArrayList;

public class TestAllResult {
    private SymmetryResult symmetryResult ;
    private DensityResult densityResult;
    private NegativeSpaceResult negativeSpaceResult;
    private ArrayList<DetectedObject> shapeDetectionResult ;
    public TestAllResult() {
    }

    public TestAllResult(SymmetryResult symmetryResult, DensityResult densityResult , NegativeSpaceResult negativeSpaceResult , ArrayList<DetectedObject> shapeDetectionResult) {
        this.symmetryResult = symmetryResult;
        this.densityResult = densityResult;
        this.negativeSpaceResult = negativeSpaceResult ;
        this.shapeDetectionResult = shapeDetectionResult  ;
    }


    public ArrayList<DetectedObject> getShapeDetectionResult() {
        return shapeDetectionResult;
    }

    public void setShapeDetectionResult(ArrayList<DetectedObject> shapeDetectionResult) {
        this.shapeDetectionResult = shapeDetectionResult;
    }

    public SymmetryResult getSymmetryResult() {
        return symmetryResult;
    }

    public void setSymmetryResult(SymmetryResult symmetryResult) {
        this.symmetryResult = symmetryResult;
    }

    public DensityResult getDensityResult() {
        return densityResult;
    }

    public void setDensityResult(DensityResult densityResult) {
        this.densityResult = densityResult;
    }

    public NegativeSpaceResult getNegativeSpaceResult() {
        return negativeSpaceResult;
    }

    public void setNegativeSpaceResult(NegativeSpaceResult negativeSpaceResult) {
        this.negativeSpaceResult = negativeSpaceResult;
    }
}
