package com.example.counterapp;

import android.os.Bundle;
import android.widget.EditText;
import androidx.appcompat.app.AppCompatActivity;
import android.view.View;
import android.widget.TextView;

import java.text.ParseException;

public class MainActivity extends AppCompatActivity {

    private Number previous_value;
    private Number step_value;

    @Override
    protected void onCreate(Bundle savedInstanceState) { // kinda works like a constructor
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        previous_value = 0;
        step_value = 1;
    }

    public void AddValue(View v) throws ParseException{
        EditText step_value_view = findViewById(R.id.StepValue);
        TextView label = findViewById(R.id.CounterValue);
        
        // check if empty submission
        if(step_value_view.getText().toString().isEmpty())
            label.setText("Choose a step size");
        else {
            step_value = Integer.parseInt(step_value_view.getText().toString());
            previous_value = previous_value.intValue() + step_value.intValue();
        }
        label.setTextSize(200);
        label.setText("value = " + previous_value);
    }

    public void RemoveValue(View v) throws ParseException{
        EditText step_value_view = findViewById(R.id.StepValue);
        TextView label = findViewById(R.id.CounterValue);

        // check if empty submission
        if(step_value_view.getText().toString().isEmpty())
            label.setText("Choose a step size");
        else {
            step_value = Integer.parseInt(step_value_view.getText().toString());
            previous_value = previous_value.intValue() - step_value.intValue();
        }
        label.setTextSize(200);
        label.setText("value = " + previous_value);
    }
}