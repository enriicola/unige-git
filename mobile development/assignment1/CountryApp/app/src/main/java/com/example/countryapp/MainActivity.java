package com.example.countryapp;

import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.RadioButton;
import android.widget.ScrollView;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        ImageView iv = findViewById(R.id.IV);
        ScrollView sv = findViewById(R.id.SV);
        TextView tv = findViewById(R.id.TV);

        // to set default visualization
        if (((RadioButton) findViewById(R.id.UK)).isChecked()) {
            iv.setImageResource(R.drawable.flag_of_the_uk);
            sv.setScrollY(0);
            tv.setText(R.string.uk);
        }
    }

    public void clickFlag(View view) {
        // is the button checked now?
        boolean checked = ((RadioButton) view).isChecked();
        ImageView iv = findViewById(R.id.IV);
        ScrollView sv = findViewById(R.id.SV);
        TextView tv = findViewById(R.id.TV);

        // check which radio button was clicked
        int id = view.getId();
        if (id == R.id.UK) {
            if (checked) {
                iv.setImageResource(R.drawable.flag_of_the_uk);
                sv.setScrollY(0);
                tv.setText(getString(R.string.uk));
            }
        } else if (id == R.id.IT) {
            if (checked) {
                iv.setImageResource(R.drawable.flag_of_italy);
                sv.setScrollY(0);
                tv.setText(R.string.it);
            }
        } else if (id == R.id.FR) {
            if (checked) {
                iv.setImageResource(R.drawable.flag_of_france);
                sv.setScrollY(0);
                tv.setText(R.string.fr);
            }
        } else if (id == R.id.ES) {
            if (checked) {
                iv.setImageResource(R.drawable.flag_of_spain);
                sv.setScrollY(0);
                tv.setText(R.string.es);
            }
        } else {
            throw new IllegalStateException("Unexpected value: " + view.getId());
        }
    }
}