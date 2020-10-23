package com.sdws.ImageProcessingSpring.models.balance;

public class BalanceCallBody {
    private String img ;

    public BalanceCallBody() {
    }

    public BalanceCallBody(String img) {
        this.img = img;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }
}
