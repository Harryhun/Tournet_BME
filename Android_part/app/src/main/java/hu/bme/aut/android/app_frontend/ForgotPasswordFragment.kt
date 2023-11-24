package hu.bme.aut.android.app_frontend

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.google.android.material.snackbar.Snackbar
import hu.bme.aut.android.app_frontend.apiconnector.AndroidFrontendConnector
import hu.bme.aut.android.app_frontend.databinding.FragmentForgotPasswordBinding


class ForgotPasswordFragment : Fragment() {
    private var connector = AndroidFrontendConnector()

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
            if (binding.etEmailAddressToSendMail.text.toString().isEmpty()) {
                binding.etEmailAddressToSendMail.requestFocus()
                binding.etEmailAddressToSendMail.error = "Please enter your email address"
            }
            else {
                val result = connector.ForgotPassword(binding.etEmailAddressToSendMail.text.toString())
                when(result.getInt("status")){
                    1 -> {
                        findNavController().navigate(R.id.action_forgot_password_to_loginFragment)
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