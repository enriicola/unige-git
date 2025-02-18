package com.example.callmanager;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import android.Manifest;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

public class InternationalCall extends AppCompatActivity {
    private String prefix; // TODO change it to a constant

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_international);

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
}