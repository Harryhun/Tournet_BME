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

        val client = OkHttpClient();
        val url = "http://10.0.2.2:3000";

        binding.startButton.setOnClickListener() {
            Thread{
                val req = Request.Builder()
                    .url(url + "/sendData")
                    .addHeader("Authorization", Credentials.basic("user", "pass"))
                    .post(binding.input.text.toString().toRequestBody("text/plain; charset=utf-8".toMediaType()))
                    .build()
                client.newCall(req).execute()
            }.start()
        }

        binding.exitButton.setOnClickListener() {
            Thread{
                val req = Request.Builder()
                    .url(url + "/requestData")
                    .addHeader("Authorization", Credentials.basic("user", "pass"))
                    .build()
                val res = client.newCall(req).execute()
                binding.output.text = res.body?.string()
            }.start()
        }
    }
}