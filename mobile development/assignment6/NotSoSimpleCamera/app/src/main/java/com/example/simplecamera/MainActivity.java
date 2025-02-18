package com.example.simplecamera;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.Toast;

import com.example.simplecamera.CameraSettings1;
import com.example.simplecamera.Click;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

public class MainActivity extends AppCompatActivity {
    // Class name for Log tag.
    private static final String LOG_TAG = MainActivity.class.getSimpleName();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        displaySavedPhoto();
    }
    private void displaySavedPhoto() {
        Bitmap savedBitmap = readPhoto();
        if (savedBitmap != null) {
            ImageView imageView = findViewById(R.id.imageView);
            imageView.setImageBitmap(savedBitmap);
        } else {
            Log.d("ReadPhoto", "Error reading photo");
    }
    }

    public void Click(View v){
        Intent intent = new Intent(this, Click.class);
        startActivity(intent);
    }

    public void CameraSettings(View v){
        Intent intent = new Intent(this, CameraSettings1.class);
        startActivity(intent);
    }

    private Bitmap readPhoto() {
        String filename = "photo.jpg";
        File file = new File(getFilesDir(), filename);

        Bitmap bitmap = null;
        try (FileInputStream fis = new FileInputStream(file)) {
            bitmap = BitmapFactory.decodeStream(fis);
            Log.d("ReadPhoto", "Photo read successfully");
        } catch (IOException e) {
            e.printStackTrace();
            Log.d("ReadPhoto", "Error reading photo", e);
        }
        return bitmap;
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
        displaySavedPhoto();
        Log.d(LOG_TAG, "onResume");
    }

}