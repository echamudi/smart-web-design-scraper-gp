package com.sdws.ImageProcessingSpring;

import org.opencv.core.Core;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class ImageProcessingSpringApplication {

	public static void main(String[] args) {
//		System.loadLibrary( Core.NATIVE_LIBRARY_NAME );
		SpringApplication.run(ImageProcessingSpringApplication.class, args);

/*
		static {
			if (!OpenCVLoader.initDebug())
				System.out.println("didn't work");
			else
				System.out.println("worked");
//				Log.d("SUCCESS", "OpenCV loaded");
		}
*/

	}

}
