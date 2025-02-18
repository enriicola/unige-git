package com.example.callmanager;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.RadioButton;
import android.widget.RadioGroup;

public class PrefixChoice extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_prefix);
        Log.d(LOG_TAG, "onCreate: activity created");
    }

    public void onClickPrefix(View v){
        RadioGroup rg = findViewById(R.id.radio_group);
        int checked = rg.getCheckedRadioButtonId();
        RadioButton rb = findViewById(checked);

        Intent intent = new Intent(this, InternationalCall.class);
        String prefix = rb.getText().toString();
        intent.putExtra("prefix", prefix);
        startActivity(intent);
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