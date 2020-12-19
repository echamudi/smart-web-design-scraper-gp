package com.sdws.ImageProcessingSpring.models.shapdetection;

import java.util.ArrayList;

public class ShapeDetectionResult {
    private ArrayList<DetectedObject> objects ;
    private int objectsCount ;


    public ShapeDetectionResult(ArrayList<DetectedObject> objects) {
        this.objects = objects;
        this.objectsCount = objects.size() ;
    }

    public ArrayList<DetectedObject> getObjects() {
        return objects;
    }

    public void setObjects(ArrayList<DetectedObject> objects) {
        this.objects = objects;
    }

    public int getObjectsCount() {
        return objectsCount;
    }

    public void setObjectsCount(int objectsCount) {
        this.objectsCount = objectsCount;
    }
}
