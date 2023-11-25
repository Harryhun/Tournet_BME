package hu.bme.aut.android.app_frontend

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.navigation.fragment.findNavController
import com.google.android.material.snackbar.Snackbar
import hu.bme.aut.android.app_frontend.apiconnector.AndroidFrontendConnector
import hu.bme.aut.android.app_frontend.databinding.FragmentRegistrationBinding


class RegistrationFragment : Fragment() {
    private var connector = AndroidFrontendConnector()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = FragmentRegistrationBinding.inflate(layoutInflater)
    }

    private lateinit var binding: FragmentRegistrationBinding
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        binding=FragmentRegistrationBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?)
    {
        super.onViewCreated(view, savedInstanceState)

        binding.btnRegister.setOnClickListener {
            if(binding.etUserNameToRegister.text.toString().isEmpty()) {
                binding.etUserNameToRegister.requestFocus()
                binding.etUserNameToRegister.error = "Please enter your username"
            }
            else if(binding.etEmailAddressToRegister.text.toString().isEmpty()) {
                binding.etEmailAddressToRegister.requestFocus()
                binding.etEmailAddressToRegister.error = "Please enter your email address"
            }
            else if(binding.etPasswordToRegister.text.toString().isEmpty()) {
                binding.etPasswordToRegister.requestFocus()
                binding.etPasswordToRegister.error = "Please enter your password"
            }
            else if(binding.etPasswordToRegisterAgain.text.toString().isEmpty()) {
                binding.etPasswordToRegisterAgain.requestFocus()
                binding.etPasswordToRegisterAgain.error = "Please enter your password again"
            }
            else if(binding.etPasswordToRegister.text.toString() != binding.etPasswordToRegisterAgain.text.toString()) {
                binding.etPasswordToRegisterAgain.requestFocus()
                binding.etPasswordToRegisterAgain.error = "Passwords are not the same"
            }
            else {
                val result = connector.SignUp(binding.etUserNameToRegister.text.toString(),
                    binding.etPasswordToRegister.text.toString(), binding.etEmailAddressToRegister.text.toString())
                when(result.getInt("status")){
                    1 -> {
                        findNavController().navigate(R.id.action_registration_to_loginFragment)
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
                    else -> Snackbar.make(it, "Unknown error occurred", 5).show()
                }
            }
        }
    }

}