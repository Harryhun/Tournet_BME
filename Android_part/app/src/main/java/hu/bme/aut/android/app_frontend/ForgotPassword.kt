package hu.bme.aut.android.app_frontend

import android.os.Bundle
import androidx.fragment.app.Fragment
import hu.bme.aut.android.app_frontend.databinding.ActivityMainBinding


class ForgotPassword : Fragment() {


    private lateinit var binding: ActivityMainBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)


    }

}