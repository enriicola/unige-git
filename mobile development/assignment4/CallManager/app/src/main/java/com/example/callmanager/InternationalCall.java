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
import android.widget.Toast;

public class InternationalCall extends AppCompatActivity {
    public static final int PREFIX_FLAG = 1; // flag for choosing the prefix
    public static final int SOS_FLAG = 2; // flag for choosing the sos
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
        String text = edn.getText().toString();
        if(text.isEmpty()){
            Toast.makeText(this, "Please enter a phone numebr", Toast.LENGTH_SHORT).show();
            return;
        }
        Intent intentImplicit=new Intent(Intent.ACTION_DIAL);
        TextView pr = findViewById(R.id.prefix);
        prefix = pr.getText().toString();
        String uri="tel:"+prefix+text;
        intentImplicit.setData(Uri.parse(uri));
        startActivity(intentImplicit);
    }

    public void makeInternationalCall(View view) {
        EditText edn = findViewById(R.id.number);
        String text = edn.getText().toString();
        if(text.isEmpty()){
            Toast.makeText(this, "Please enter a phone number", Toast.LENGTH_SHORT).show();
            return;
        }
        Intent intentImplicit=new Intent(Intent.ACTION_CALL);
        TextView pr = findViewById(R.id.prefix);
        prefix = pr.getText().toString();
        String uri="tel:"+prefix+text;
        intentImplicit.setData(Uri.parse(uri));
        try {
            startActivity(intentImplicit);
        } catch (SecurityException e) {
            ActivityCompat.requestPermissions(InternationalCall.this, new String[]{Manifest.permission.CALL_PHONE},1);
        }
    }

    public void chooseAnotherPrefix(View v){
        Intent choose_intent = new Intent(this, PrefixChoice.class);
        choose_intent.putExtra("choose", true);
        startActivityForResult(choose_intent, PREFIX_FLAG);
    }

    public void chooseSOS(View v){
        Intent sos_intent = new Intent(this, SOS.class);
        startActivityForResult(sos_intent, SOS_FLAG);
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == PREFIX_FLAG) { // Identify activity
            if (resultCode == RESULT_OK) { // Activity succeeded
                String reply = data.getStringExtra(PrefixChoice.EXTRA_REPLY);
                TextView prefixText = findViewById(R.id.prefix);
                prefixText.setText(reply);
            }
        } else if (requestCode == SOS_FLAG) {
            if (resultCode == RESULT_OK) { // Activity succeeded
                String reply = data.getStringExtra(SOS.EXTRA_REPLY);
                TextView numberText = findViewById(R.id.number);
                numberText.setText(reply);
            }
        }
    }
}