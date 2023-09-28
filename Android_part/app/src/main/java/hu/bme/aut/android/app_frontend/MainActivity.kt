package hu.bme.aut.android.app_frontend

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import hu.bme.aut.android.app_frontend.databinding.ActivityMainBinding
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import io.socket.client.IO

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        var s = IO.socket("http://10.0.2.2:3000");
        s.connect();

        binding.startButton.setOnClickListener() {
            s.emit("sendData", binding.input.text.toString());
        }

        binding.exitButton.setOnClickListener() {
            s.emit("requestData");
        }

        s.on("serverDataReply", { args ->
            runOnUiThread()
            {
                binding.output.text = args[0].toString();
            }
        })
    }
}