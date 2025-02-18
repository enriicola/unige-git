package com.example.simplecamera;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

public class CameraSettings1 extends AppCompatActivity {
    private static final String LOG_TAG = MainActivity.class.getSimpleName();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_camera_settings1);

        Button Test = findViewById(R.id.TEST);
        TextView TT = (TextView) findViewById(R.id.TT);
        Test.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                TT.setText("CLICK");
            }
        });
        Test.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View v) {
                TT.setText("LONG CLICK");
                return true;
            }
        });
    }
    public void ReturnBack(View v){
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
        //finish();
    }

    public void GoToSettings2(View v){
        Intent intent = new Intent(this, CameraSettings2.class);
        startActivity(intent);
        //finish();
    }

    @Override
    protected void onStart() {
        super.onStart();
        Log.d(LOG_TAG, "onStart");
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        Log.d(LOG_TAG, "onRestart");
    }

    @Override
    protected void onPause(){
        super.onPause();
        Log.d(LOG_TAG, "onPause");
    }

    @Override
    protected void onStop(){
        super.onStop();
        Log.d(LOG_TAG, "onStop");
    }

    @Override
    protected void onResume(){
        super.onResume();
        Log.d(LOG_TAG, "onResume");
    }
}