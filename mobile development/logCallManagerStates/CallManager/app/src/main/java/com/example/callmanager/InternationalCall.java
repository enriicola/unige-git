package com.example.callmanager;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import android.Manifest;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

public class InternationalCall extends AppCompatActivity {
    private String prefix; // TODO change it to a constant

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_international);
        Log.d(LOG_TAG, "onCreate: activity created");

        // get the intent data from the activity which was used to choose the prefix
        Intent intent = getIntent();
        prefix = intent.getStringExtra("prefix");
        TextView prefixText = findViewById(R.id.prefix);
        prefixText.setText(prefix);
    }

    public void compose(View view) {
        EditText edn =findViewById(R.id.number);
        Intent intentImplicit=new Intent(Intent.ACTION_DIAL);
        String uri="tel:"+prefix+edn.getText().toString();
        intentImplicit.setData(Uri.parse(uri));
        startActivity(intentImplicit);
    }

    public void makeInternationalCall(View view) {
        EditText edn = findViewById(R.id.number);
        Intent intentImplicit=new Intent(Intent.ACTION_CALL);
        String uri="tel:"+prefix+edn.getText().toString();
        intentImplicit.setData(Uri.parse(uri));
        try {
            startActivity(intentImplicit);
        }
        catch (SecurityException e) {
            ActivityCompat.requestPermissions(InternationalCall.this, new String[]{Manifest.permission.CALL_PHONE},1);
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