package com.example.callmanager;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Log.d(LOG_TAG, "onCreate: activity created");
    }

    public void startCall(View v){
        Intent i=new Intent(this, Call.class);
        startActivity(i);
    }

    public void startSMS(View v){
        Intent i=new Intent(this, SMS.class);
        startActivity(i);
    }

    public void startInternationalCall(View v){
        Intent i=new Intent(this, PrefixChoice.class);
        startActivity(i);
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