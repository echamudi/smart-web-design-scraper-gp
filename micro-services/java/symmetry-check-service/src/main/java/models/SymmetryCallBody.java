package models;

import javax.annotation.PostConstruct;


public class SymmetryCallBody   {

    private String img  ;

   public SymmetryCallBody() {}
    public SymmetryCallBody(String img) {
        this.img = img;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }
}
