package com.example.callmanager;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.RadioButton;
import android.widget.RadioGroup;

public class SOS extends AppCompatActivity {

    public static final String EXTRA_REPLY = "chosen SOS number";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sos);
    }

    public void onClickSOS(View v){
        RadioGroup rg = findViewById(R.id.rg_sos);
        int checked = rg.getCheckedRadioButtonId();
        RadioButton rb = findViewById(checked);
        String number = rb.getText().toString();
        Intent replyIntent = new Intent();
        replyIntent.putExtra(EXTRA_REPLY, number);
        setResult(RESULT_OK, replyIntent);
        finish();
    }
}