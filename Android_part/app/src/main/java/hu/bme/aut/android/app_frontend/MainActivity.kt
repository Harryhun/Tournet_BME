package hu.bme.aut.android.app_frontend

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import hu.bme.aut.android.app_frontend.databinding.ActivityMainBinding
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import okhttp3.Credentials
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody


class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()

        super.onCreate(savedInstanceState)


        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

    }
}