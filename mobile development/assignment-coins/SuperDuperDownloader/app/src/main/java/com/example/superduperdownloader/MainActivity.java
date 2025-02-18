package com.example.superduperdownloader;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.ImageView;
import android.widget.TableLayout;
import android.widget.TableRow;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.example.superduperdownloader.databinding.ActivityMainBinding;

import java.io.InputStream;
import java.util.Objects;
import java.util.concurrent.Executor;

public class MainActivity extends AppCompatActivity {
    public final String[] coin_urls = new String[9];

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ActivityMainBinding binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        setSupportActionBar(binding.toolbar);

        for(int i = 0; i < 9; ++i)
            coin_urls[i] = getResources().getString( getResources().getIdentifier("url"+(i+1), "string", getPackageName()) );
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    private class DownloadImageTask extends AsyncTask<Void, Void, Bitmap> {
        final ImageView bmImage;
        final String sourceURL;
        final boolean rotateImage;

        public DownloadImageTask(ImageView bmImage, String url, boolean rotateImage) {
            this.bmImage = bmImage;
            this.sourceURL = url;
            this.rotateImage = rotateImage;
        }

        protected Bitmap doInBackground(Void... urls) {
            Bitmap mIcon;
            try {
                InputStream in = new java.net.URL(sourceURL).openStream();
                mIcon = BitmapFactory.decodeStream(in);
                if(this.rotateImage) {
                    Matrix matrix = new Matrix();
                    matrix.postRotate(90);
                    int numberOfRotations = 40;
                    for(int i = 0; i < numberOfRotations; ++i) {
                        Bitmap scaledBitmap = Bitmap.createScaledBitmap(mIcon, mIcon.getWidth(), mIcon.getHeight(), true);
                        mIcon = Bitmap.createBitmap(scaledBitmap, 0, 0, scaledBitmap.getWidth(), scaledBitmap.getHeight());
                    }
                }
            }
            catch(Exception e) {
                mIcon = BitmapFactory.decodeResource(getApplicationContext().getResources(), R.drawable.error);
                Log.e("DownloadImageTask", Objects.requireNonNull(e.getMessage()));
            }
            return mIcon;
        }

        protected void onPostExecute(Bitmap result) {
            bmImage.setImageBitmap(result);
        }
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        int id = item.getItemId();

        ImageView[] imageViews = new ImageView[9];
        TableLayout tableView = findViewById(R.id.tableLayout);
        for(int rowIndex = 0; rowIndex < tableView.getChildCount(); rowIndex++) {
            TableRow row = (TableRow) tableView.getChildAt(rowIndex);
            for(int colIndex = 0; colIndex < row.getChildCount(); colIndex++) {
                ImageView imgView = (ImageView) row.getChildAt(colIndex);
                imageViews[rowIndex * tableView.getChildCount() + colIndex] = imgView;
            }
        }

        if (id == R.id.menu_reset) {
            for(ImageView imgView : imageViews)
                imgView.setImageBitmap(null);

            return true;
        }

        Executor ex = id == R.id.menu_serial ? AsyncTask.SERIAL_EXECUTOR : (id == R.id.menu_parallel ? AsyncTask.THREAD_POOL_EXECUTOR : null);
        boolean shouldRotateImages = id == R.id.menu_parallel;

        if(ex == null)
            return super.onOptionsItemSelected(item);

        for (int i = 0; i < 9; ++i) {
            DownloadImageTask task = new DownloadImageTask(imageViews[i], coin_urls[i], shouldRotateImages);
            task.executeOnExecutor(ex);
        }

        return true;
    }
}