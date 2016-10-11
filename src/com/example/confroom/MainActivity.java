package com.example.confroom;

import android.os.Bundle;
import org.apache.cordova.DroidGap;

import android.view.Menu;

public class MainActivity extends DroidGap {

    @Override
	public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
    }

}
