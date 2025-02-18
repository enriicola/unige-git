package com.example.iwillsensorvive;

import androidx.appcompat.app.AppCompatActivity;
import android.content.Context;
import android.content.Intent;
import android.hardware.Sensor;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        SensorManager sensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);

        List<Sensor> sensors = sensorManager.getSensorList(Sensor.TYPE_ALL);
        if(sensors.isEmpty())
            setSensorListContent("No sensors found");
        else{
            StringBuilder sensorDisplayString = new StringBuilder();
            for(Sensor sensor: sensors)
                sensorDisplayString.append(sensor.getName()).append("\n");

            setSensorListContent("Number of sensors = " + sensors.size() + "\n\nList of available sensors:\n\n" + sensorDisplayString);
        }
    }

    void setSensorListContent(CharSequence content) {
        ((TextView) findViewById(R.id.sensor_list)).setText(content.toString());
    }

    public void openLightSensor(View v) {
        Intent it = new Intent(this, LightSensor.class);
        startActivity(it);
    }

    public void openAccelerometer(View v) {
        Intent it = new Intent(this, Accelerometer.class);
        startActivity(it);
    }
}