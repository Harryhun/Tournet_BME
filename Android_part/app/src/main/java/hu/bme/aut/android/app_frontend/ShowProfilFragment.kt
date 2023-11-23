package hu.bme.aut.android.app_frontend

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import hu.bme.aut.android.app_frontend.apiconnector.AndroidFrontendConnector

import hu.bme.aut.android.app_frontend.databinding.FragmentShowProfilBinding

class ShowProfilFragment: Fragment(){
    private lateinit var binding: FragmentShowProfilBinding
    private var connector = AndroidFrontendConnector()


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        binding=FragmentShowProfilBinding.inflate(inflater, container, false)
        return binding.root
    }
    override fun onViewCreated(view: View, savedInstanceState: Bundle?)
    {
        super.onViewCreated(view, savedInstanceState)

        val data= connector.GetUserData()

        binding.etUserNameToChange.setText(data.getString("userName"))
        binding.etEmailAddressToChange.setText(data.getString("emailAddress"))
        binding.etPasswordToChange.setText(data.getString("password"))

        binding.btnSaveChanges.setOnClickListener {
            connector.UpdateProfile(0,binding.etUserNameToChange.text.toString())
            connector.UpdateProfile(1,binding.etEmailAddressToChange.text.toString())
            connector.UpdateProfile(2,binding.etPasswordToChange.text.toString())
            findNavController().navigate(R.id.action_showProfilFragment_to_startMenuFragment)
        }
        binding.btnBackToBeforeFragment.setOnClickListener {
            val id=findNavController().previousBackStackEntry!!.id

            when(id){
                R.id.frPlacesOfInterest.toString() -> findNavController().navigate(R.id.action_showProfilFragment_to_placesOfInterestFragment)
                R.id.frStartMenu.toString() -> findNavController().navigate(R.id.action_showProfilFragment_to_startMenuFragment)
            }

        }

    }



}