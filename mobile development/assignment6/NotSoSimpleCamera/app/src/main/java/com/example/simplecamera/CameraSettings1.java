package com.example.simplecamera;

import androidx.appcompat.app.AppCompatActivity;


import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import java.io.FileReader;



import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

public class CameraSettings1 extends AppCompatActivity {
    private static final String LOG_TAG = MainActivity.class.getSimpleName();
    private EditText editText;
    private String content;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_camera_settings1);

        Button Test = findViewById(R.id.TEST);
        TextView TT = (TextView) findViewById(R.id.TT);



        Test.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                TT.setText("CLICK");
            }
        });
        Test.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View v) {
                TT.setText("LONG CLICK");
                return true;
            }
        });
    }
    public void ReturnBack(View v){
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
        //finish();
    }

    public void GoToSettings2(View v){
        Intent intent = new Intent(this, CameraSettings2.class);
        startActivity(intent);
        //finish();
    }

    public void Save(View v) throws FileNotFoundException {
        editText = findViewById(R.id.editTextText);
        content = editText.getText().toString();

        File file = new File(getFilesDir(), "my-file-name.txt");
        try {
            FileOutputStream outputStream = new FileOutputStream(file);
            outputStream.write(content.getBytes());
            outputStream.close();;
        } catch (Exception e) {
            e.printStackTrace();
            Log.e("Save", "Error saving file", e);
            Toast.makeText(this, "Error saving file", Toast.LENGTH_SHORT).show();
        }
    }

    public String read() {
        File file = new File(getFilesDir(), "my-file-name.txt");
        StringBuilder stringBuilder = new StringBuilder();

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;

            while ((line = reader.readLine()) != null) {
                stringBuilder.append(line).append("\n");
            }

            String fileContent = stringBuilder.toString().trim();
            Log.d("Read", "File content: " + fileContent); // Log per il debug
            return fileContent;
        } catch (IOException e) {
            e.printStackTrace();
            Toast.makeText(this, "Error reading file", Toast.LENGTH_SHORT).show();
        }

        return null;
    }

    public void Read(View v) {
        Toast.makeText(this, "Read button clicked", Toast.LENGTH_SHORT).show(); // Toast per il debug
        String fileContent = read();

        if (fileContent != null) {
            TextView textView = findViewById(R.id.textView2);
            textView.setText(fileContent);
        } else {
            Toast.makeText(this, "File content is null", Toast.LENGTH_SHORT).show(); // Toast per il debug
        }
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
}