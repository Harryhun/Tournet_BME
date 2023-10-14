package hu.bme.aut.android.app_frontend

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.navigation.fragment.findNavController
import hu.bme.aut.android.app_frontend.databinding.FragmentRegistrationBinding


class Registration : Fragment() {


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
                findNavController().navigate(R.id.action_registration_to_loginFragment)
            }
        }
    }

}