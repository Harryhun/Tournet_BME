package hu.bme.aut.android.app_frontend

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.navigation.fragment.findNavController
import com.google.android.material.snackbar.Snackbar
import hu.bme.aut.android.app_frontend.apiconnector.AndroidFrontendConnector
import hu.bme.aut.android.app_frontend.databinding.ActivityMainBinding.inflate
import hu.bme.aut.android.app_frontend.databinding.FragmentLoginBinding



class LoginFragment : Fragment() {
    private var connector = AndroidFrontendConnector()
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = FragmentLoginBinding.inflate(layoutInflater)
    }


    private lateinit var binding : FragmentLoginBinding

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        binding=FragmentLoginBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?)
    {
        super.onViewCreated(view, savedInstanceState)

        binding.btnLogin.setOnClickListener {
            if(binding.etUserName.text.toString().isEmpty()) {
                binding.etUserName.requestFocus()
                binding.etUserName.error = "Please enter your username"
            }
            else if(binding.etEmailAddress.text.toString().isEmpty()) {
                binding.etEmailAddress.requestFocus()
                binding.etEmailAddress.error = "Please enter your email address"
            }
            else if(binding.etPassword.text.toString().isEmpty()) {
                binding.etPassword.requestFocus()
                binding.etPassword.error = "Please enter your password"
            }
            else {
                 val result = connector.Login(binding.etUserName.text.toString(), binding.etPassword.text.toString())
                when(result.getInt("status")){
                    1 -> {
                        //val action=LoginFragmentDirections.actionLoginFragmentToStartMenuFragment("Mukodik_safeargs")//just Test
                        findNavController().navigate(R.id.action_loginFragment_to_startMenuFragment)
                    }
                    -1 -> {
                        Snackbar.make(it, "Connection problem", 5).show()
                    }
                    0 -> {
                        Snackbar.make(it, "Username not found", 5).show()
                    }
                    2 -> {
                        Snackbar.make(it, "Incorrect password", 5).show()
                    }
                }

            }
        }
        binding.btnForgotPassword.setOnClickListener {
            findNavController().navigate(R.id.action_loginFragment_to_passwordSendFragment)
        }
        binding.btnSingUp.setOnClickListener{
            findNavController().navigate(R.id.action_loginFragment_to_registrationFragment)
        }
    }

}