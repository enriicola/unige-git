package com.example.callmanager;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.Manifest;

public class Call extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_call);
        Log.d(LOG_TAG, "onCreate: activity created");
    }

    public void compose (View v) {
        EditText edn = findViewById(R.id.number);
        Intent intentImplicit=new Intent(Intent.ACTION_DIAL);
        String uri="tel:"+edn.getText().toString();
        intentImplicit.setData(Uri.parse(uri));
        startActivity(intentImplicit);
    }

    public void makeCall (View v){
        EditText edn = findViewById(R.id.number);
        Intent intentImplicit=new Intent(Intent.ACTION_CALL);
        String uri="tel:"+edn.getText().toString();
        intentImplicit.setData(Uri.parse(uri));
        try {
            startActivity(intentImplicit);
        }
        catch (SecurityException e) {
            ActivityCompat.requestPermissions(Call.this, new String[]{Manifest.permission.CALL_PHONE},1);
        }
    }
    private static final String LOG_TAG = MainActivity.class.getSimpleName();

    @Override
    protected void onRestart() {
        super.onRestart();
        Log.d(LOG_TAG, "onRestart: activity restarted");
    }

    @Override
    protected void onStart() {
        super.onStart();
        Log.d(LOG_TAG, "onStart: activity started");
    }

    @Override
    protected void onResume() {
        super.onResume();
        Log.d(LOG_TAG, "onResume: activity resumed");
    }

    @Override
    protected void onPause() {
        super.onPause();
        Log.d(LOG_TAG, "onPause: activity paused");
    }

    @Override
    protected void onStop() {
        super.onStop();
        Log.d(LOG_TAG, "onStop: activity stopped");
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Log.d(LOG_TAG, "onDestroy: activity destroyed");
    }
}