package com.sdws.ImageProcessingSpring.models.shapdetection;

public class ShapeDetectionCallBody {

    private String img  ;


    public ShapeDetectionCallBody() {
    }

    public ShapeDetectionCallBody(String img) {
        this.img = img;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }
}
