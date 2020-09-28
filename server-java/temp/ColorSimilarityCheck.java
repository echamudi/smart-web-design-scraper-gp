import java.awt.*;

public class ColorSimilarityCheck {



    public static void main(String[] args){


            Color c1 = new Color(996699)  ;  ;
            Color c2 = new Color(996699) ;


            System.out.println("R= "+ c1.getRed() + " B= " +c1.getBlue() +" G= " + c1.getGreen() );
            System.out.println("R= "+ c2.getRed() + " B= " +c2.getBlue() +" G= " + c2.getGreen() );

            System.out.println("difference percentage : " + howDiff(c1,c2) + "%") ;


    }



    private static double howDiff(Color c1 , Color c2) {
        double dis = Math.sqrt(Math.pow(c2.getRed()-c1.getRed(),2)+Math.pow(c2.getGreen()-c1.getGreen(),2)+ Math.pow(c2.getBlue()-c1.getBlue(),2));


        return (dis / Math.sqrt(Math.pow(255,2)+Math.pow(255,2)+Math.pow(255,2))) * 100 ;
    }



}
