package com.example.basicbrowser;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.Toast;




public class MainActivity extends AppCompatActivity {

    private ProgressBar progressBar;
    private WebView webView;

    public void assignViews() {

        progressBar = (ProgressBar) findViewById(R.id.progressBar);
        webView = (WebView) findViewById(R.id.webView);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        assignViews();


        webView.getSettings().getBuiltInZoomControls();
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                super.onProgressChanged(view, newProgress);
              progressBar.setProgress(newProgress);



            }

            @Override
            public void onReceivedTitle(WebView view, String title) {
                super.onReceivedTitle(view, title);
                getSupportActionBar().setTitle(title);
            }

        });
        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl("https://duckduckgo.com");

    }

    //inflate the menu to main activity
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater menuInflater = getMenuInflater();
        menuInflater.inflate(R.menu.menu,menu);
        return super.onCreateOptionsMenu(menu);
    }

    //Listener for each of the items
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {

        switch (item.getItemId()){

            case R.id.menu_back:
                webView.goBack();
                break;

            case R.id.menu_forward:
                onForwardPressed();
                break;

            case R.id.menu_refresh:
            webView.reload();
                break;


        }
        return super.onOptionsItemSelected(item);
    }

    //press the back button and go back, NOT exit the app
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if ((keyCode == KeyEvent.KEYCODE_BACK) && this.webView.canGoBack()) {
            this.webView.goBack();
            return true;
        } else {
            return super.onKeyDown(keyCode, event);
        }
    }

    private void onForwardPressed(){
        if(this.webView.canGoForward()){
            webView.goForward();
        }else {
            Toast.makeText(this, "Can't go further", Toast.LENGTH_SHORT).show();
        }
    }
}

