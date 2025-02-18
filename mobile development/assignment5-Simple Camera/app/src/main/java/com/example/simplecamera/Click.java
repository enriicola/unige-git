package com.example.simplecamera;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;
import android.Manifest;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class Click extends AppCompatActivity {

    private static final String LOG_TAG = Click.class.getSimpleName();
    private static final int REQUEST_IMAGE_CAPTURE = 1;
    private static final int CAMERA_PERMISSION_CODE = 2;
    private ImageView mImageView;
    private ImageView mImageView2;
    private Bitmap mLastImage;
    private Bitmap mSecondLastImage;
    private String mImageViewDate;
    private String mImageView2Date;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_click);
        mImageView = findViewById(R.id.IV);
        mImageView2 = findViewById(R.id.IV2);

        Button takePictureButton = findViewById(R.id.PICTURE);
        takePictureButton.setOnClickListener(v -> dispatchTakePictureIntent());

        mImageView.setOnLongClickListener(v -> {
            showDeleteConfirmationDialog(mLastImage, 1);
            return true;
        });
        mImageView2.setOnLongClickListener(v -> {
            showDeleteConfirmationDialog(mSecondLastImage, 2);
            return true;
        });
        // set the event listeners for displaying the image
        mImageView.setOnClickListener(view -> showDateTime(0));
        mImageView2.setOnClickListener(view -> showDateTime(1));
    }

    private void dispatchTakePictureIntent() {
        // Check if CAMERA permission is granted
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                != PackageManager.PERMISSION_GRANTED) {
            // Request CAMERA permission if not granted
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.CAMERA},
                    CAMERA_PERMISSION_CODE);
        } else {
            // Start camera intent if permission is already granted
            Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            if (cameraIntent.resolveActivity(getPackageManager()) != null) {
                startActivityForResult(cameraIntent, REQUEST_IMAGE_CAPTURE);
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == CAMERA_PERMISSION_CODE) {
            if (grantResults.length > 0
                    && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // Start camera intent if permission is granted
                Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                if (cameraIntent.resolveActivity(getPackageManager()) != null) {
                    startActivityForResult(cameraIntent, REQUEST_IMAGE_CAPTURE);
                }
            } else {
                // Show a message or take other action if permission is denied
                Toast.makeText(this, "Camera permission denied", Toast.LENGTH_SHORT).show();
            }
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQUEST_IMAGE_CAPTURE && resultCode == RESULT_OK) {
            // Display captured image in the first ImageView
            Bundle extras = null;
            if (data != null) {
                extras = data.getExtras();
            }
            assert extras != null;
            Bitmap imageBitmap = (Bitmap) extras.get("data");

            // Save the last two images
            mSecondLastImage = mLastImage;
            mLastImage = imageBitmap;
            saveTheDate();

            // Display the last two images in the ImageViews
            if (mLastImage != null) {
                mImageView.setImageBitmap(mLastImage);
            }
            if (mSecondLastImage != null) {
                mImageView2.setImageBitmap(mSecondLastImage);
            }
        }
    }

    private void saveTheDate() {
        String date =  new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(new Date());
        mImageView2Date = mImageViewDate;
        mImageViewDate = date;
    }

    //function to get the Date displayed
    private void showDateTime(int image){
        if(image == 0){
            Toast.makeText(this, "Image taken at " + mImageViewDate, Toast.LENGTH_LONG).show(); // Display the date and time in a Toast message
        } else if (image == 1) {
            Toast.makeText(this, "Image taken at " + mImageView2Date, Toast.LENGTH_LONG).show();
        } else{
            Toast.makeText(this, "Not valid id picture choice", Toast.LENGTH_SHORT).show();
        }
    }

    // display a Confirmation Dialog
    private void showDeleteConfirmationDialog(final Bitmap image, final int position) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setMessage("Are you sure you want to delete this image?");
        builder.setPositiveButton("Delete", (dialog, which) -> {
            deleteImage(position);
            dialog.dismiss();
        });
        builder.setNegativeButton("Cancel", (dialog, which) -> dialog.dismiss());
        builder.show();
    }

    private void deleteImage(int position) {
        if (position == 1) {
            mLastImage = mSecondLastImage;
            mSecondLastImage = null;
            mImageView.setImageBitmap(mLastImage);
            mImageView2.setImageBitmap(null);
        } else {
            mSecondLastImage = null;
            mImageView2.setImageBitmap(null);
        }
        Toast.makeText(this, "Image deleted", Toast.LENGTH_SHORT).show();
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