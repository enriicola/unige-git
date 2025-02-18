package com.calculator;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import java.util.Locale;

public class MainActivity extends AppCompatActivity {
    private String a;
    private String b;
    private String operand;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        a = "";
        b = "";
        operand = null;
    }

    public void clear(View view) {
        a = "";
        b = "";
        operand = null;
        TextView textView = findViewById(R.id.showCalculator);
        textView.setText("0");
    }

    public void delete(View view) {
        TextView textView = findViewById(R.id.showCalculator);
        if(!b.isEmpty()) {//if(!b.equals("")) {
            b = b.substring(0, b.length() - 1);
            textView.setText(b);
        }
        else if(!a.isEmpty()) {//else if(!a.equals("")) {
            a = a.substring(0, a.length() - 1);
            textView.setText(a);
        }
    }

    public void buttonHandler(View view) {
        Button button = ((Button) view);
        TextView showCalcTextView = findViewById(R.id.showCalculator);
        String showCalcContent = showCalcTextView.getText().toString();
        String b_text = button.getText().toString();
        if (b_text.equals("0") && (a.equals("0")||b.equals("0")))
            return; // skip if multiple points occurs

        // Check if another operator is pressed while two numbers and an operator are already set
        boolean operand_check = b_text.equals("+") || b_text.equals("-") || b_text.equals("*") || b_text.equals("/");
        if (!b.isEmpty() && operand_check) {
            // remember the pressed operator
            operand = b_text;
            calculate(view);
            // while done the result re-obtain the operand to continue to concatenate operations
            operand = b_text;
        }
        else if (b_text.equals(".")) {
            if ((!a.contains(".") && operand == null) || (!b.contains(".") && operand != null)) {
                // add the point to the current number
                if (operand == null) {
                    if (a.isEmpty()) a = "0.";
                    else a = a.concat(b_text);
                    showCalcTextView.setText(a);
                }
                else {
                    if (b.isEmpty()) b = "0.";
                    else b = b.concat(b_text);
                    showCalcTextView.setText(b);
                }
            }
            else
                Toast.makeText(this, "inserting multiple decimal points ...", Toast.LENGTH_SHORT).show();
            // save the a number when operators occurs
        }
        else if(operand_check){
            // if another operand is passed the result is computed
            operand = b_text;
            a = showCalcContent;
            //sc.setText("");
        }
        // since no operand are passed continue to set the a number
        else if (operand == null){
            // if we have touched 0 we need to remove it if other numbers occur
            if(a.equals("0"))
                a = "";
            a = a.concat(b_text);
            showCalcTextView.setText(a);
        }
        // otherwise obtain the b number
        else {
            if(b.equals("0"))
                b = "";
            b = b.concat(b_text);
            showCalcTextView.setText(b);
        }
    }

    public void calculate(View view) {
        TextView showCalcTextView = findViewById(R.id.showCalculator);
        if (!b.isEmpty() && operand != null) {
            double a_double = Double.parseDouble(a);
            double b_double = Double.parseDouble(b);
            double result = 0;
            switch (operand) {
                case "+":
                    result = a_double + b_double;
                    break;
                case "-":
                    result = a_double - b_double;
                    break;
                case "*":
                    result = a_double * b_double;
                    break;
                case "/":
                    if (b_double == 0) {
                        Toast.makeText(this, "Divisions by zero is not allowed", Toast.LENGTH_SHORT).show();
                        b = "";
                        return;
                    }
                    result = a_double / b_double;
                    break;
            }
            if (result == (int) result) { // check if result is an integer
                showCalcTextView.setText(String.format(Locale.getDefault(), "%d", (int) result)); //showCalcTextView.setText(String.format("%d", (int) result));
                a = String.valueOf((int) result);
            } else {
                showCalcTextView.setText(String.format("%s", result));
                a = String.valueOf(result);
            }
            b = "";
            operand = null;
        }
    }
}