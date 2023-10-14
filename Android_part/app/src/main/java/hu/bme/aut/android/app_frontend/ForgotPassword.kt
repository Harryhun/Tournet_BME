package hu.bme.aut.android.app_frontend

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import hu.bme.aut.android.app_frontend.databinding.ActivityMainBinding
import hu.bme.aut.android.app_frontend.databinding.FragmentForgotPasswordBinding


class ForgotPassword : Fragment() {


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = FragmentForgotPasswordBinding.inflate(layoutInflater)


    }
    private lateinit var binding: FragmentForgotPasswordBinding

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        binding=FragmentForgotPasswordBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?)
    {
        super.onViewCreated(view, savedInstanceState)

        binding.btnSendPasswordToEmail.setOnClickListener {
            if(binding.etUserNameToSendMail.text.toString().isEmpty()) {
                binding.etUserNameToSendMail.requestFocus()
                binding.etUserNameToSendMail.error = "Please enter your Username"
            }
            else if (binding.etEmailAddressToSendMail.text.toString().isEmpty()) {
                binding.etEmailAddressToSendMail.requestFocus()
                binding.etEmailAddressToSendMail.error = "Please enter your email address"
            }
            else {
                findNavController().navigate(R.id.action_password_send_to_loginFragment)
            }
        }
    }

}