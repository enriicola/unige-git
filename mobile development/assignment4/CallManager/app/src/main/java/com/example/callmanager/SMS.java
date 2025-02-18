package com.example.callmanager;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

public class SMS extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sms);
    }

    public void makeSMS (View v){
        EditText edn =(EditText)findViewById(R.id.tel_number);
        EditText message = (EditText)findViewById(R.id.sms_content);
        Intent intent = new Intent(Intent.ACTION_SENDTO);
        intent.setData(Uri.parse("sms_to:"+edn.getText().toString()));  // This ensures only SMS apps respond
        intent.putExtra("sms_body", message.getText().toString());
        startActivity(intent);
    }
}