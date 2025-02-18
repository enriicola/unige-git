package com.example.callmanager;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.RadioButton;
import android.widget.RadioGroup;

public class PrefixChoice extends AppCompatActivity {
    public static final String EXTRA_REPLY = "chosen prefix";
    private boolean choice;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_prefix);
        Intent intent = getIntent();
        choice = intent.getBooleanExtra("choice", false);
    }

    public void onClickPrefix(View v){
        RadioGroup rg = findViewById(R.id.rg_international);
        int checked = rg.getCheckedRadioButtonId();
        RadioButton rb = findViewById(checked);
        String prefix = rb.getText().toString();

        if(choice){
            Intent replyIntent = new Intent();
            replyIntent.putExtra(EXTRA_REPLY, prefix);
            setResult(RESULT_OK, replyIntent);
            finish();
        }
         else {
            Intent intent = new Intent(this, InternationalCall.class);
            intent.putExtra("prefix", prefix);
            startActivity(intent);
            finish();
        }
        // Intent intent = new Intent(this, InternationalCall.class);
        // String prefix = rb.getText().toString();
        // intent.putExtra("prefix", prefix);
        // startActivity(intent);
    }

    // public static class Sos { }

    public void wiki(View v){
        Uri uri = Uri.parse("https://en.wikipedia.org/wiki/List_of_international_call_prefixes");
        Intent it = new Intent(Intent.ACTION_VIEW,uri);
        startActivity(it);
    }
}