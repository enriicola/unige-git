package com.example.callmanager;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.RadioButton;
import android.widget.RadioGroup;

public class PrefixChoice extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_prefix);
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
}