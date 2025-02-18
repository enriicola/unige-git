package com.example.sharedpref;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SwitchCompat;

import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;

public class MainActivity extends AppCompatActivity {
    private SharedPreferences preferences;
    private String username;
    private String loc;
    private static final String LOG_TAG = MainActivity.class.getSimpleName();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        String sharedPrefFile = "com.example.sharedpref";
        preferences = getSharedPreferences(sharedPrefFile, MODE_PRIVATE);
        username = preferences.getString("username", "");
        loc = preferences.getString("location", "");

        boolean bg_flag = preferences.getBoolean("gray_bg", false);
        // Log.d(LOG_TAG, "bg_flag: "+bg_flag);

        // use that values e.g., for initializing UI widgets
        EditText username_view = findViewById(R.id.username_et);
        EditText loc_view = findViewById(R.id.loc_et);
        SwitchCompat _switch = findViewById(R.id.gray_bg);
        username_view.setText(username);
        loc_view.setText(loc);

        _switch.setChecked(bg_flag);
        getWindow().getDecorView().setBackgroundColor(bg_flag?Color.GRAY:Color.WHITE);
        
        _switch.setOnClickListener(view -> {
            // "your condition"? "step if true":"step if condition fails"
            getWindow().getDecorView().setBackgroundColor(_switch.isChecked()?Color.GRAY:Color.WHITE);
        });
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

    public void Save(View v){
        EditText username = findViewById(R.id.username_et);
        EditText loc = findViewById(R.id.loc_et);
        this.username = username.getText().toString();
        this.loc = loc.getText().toString();
        SharedPreferences.Editor preferencesEditor = preferences.edit();
        preferencesEditor.putString("username", this.username);
        preferencesEditor.putString("location", this.loc);

        // get the background
        SwitchCompat _switch = findViewById(R.id.gray_bg);

        preferencesEditor.putBoolean("gray_bg", _switch.isChecked());

        preferencesEditor.apply();
    }

    public void Clear(View v){
        EditText username = findViewById(R.id.username_et);
        EditText loc = findViewById(R.id.loc_et);
        SwitchCompat _switch = findViewById(R.id.gray_bg);
        SharedPreferences.Editor preferencesEditor = preferences.edit();
        this.username = "";
        this.loc = "";
        username.setText(this.username);
        loc.setText(this.loc);
        _switch.setChecked(false);
        getWindow().getDecorView().setBackgroundColor(Color.WHITE);
        preferencesEditor.clear();
        preferencesEditor.apply();
    }

    @Override
    public void finish() {
        super.finish();
        Log.d(LOG_TAG, "onFinish");
    }
}