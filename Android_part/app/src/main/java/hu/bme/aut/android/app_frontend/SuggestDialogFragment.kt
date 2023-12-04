package hu.bme.aut.android.app_frontend

import android.app.AlertDialog
import android.app.Dialog
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.DialogFragment
import com.google.android.material.snackbar.Snackbar
import hu.bme.aut.android.app_frontend.databinding.FragmentDialogRatingBinding
import hu.bme.aut.android.app_frontend.databinding.FragmentSuggestDialogBinding

class SuggestDialogFragment(private val listener: SuggestDialogListener) : DialogFragment() {
    private lateinit var binding: FragmentSuggestDialogBinding

    interface SuggestDialogListener{
        fun onSuggestionMade(name: String)
    }

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        binding = FragmentSuggestDialogBinding.inflate(layoutInflater)

        return AlertDialog.Builder(requireContext())
            .setTitle("Make a suggestion")
            .setView(binding.root)
            .setPositiveButton(R.string.button_ok){ _,_ ->
                if(isValid()){
                    Log.d("SUGGESTEDNAME", binding.etSuggestedName.text.toString())
                    listener.onSuggestionMade(binding.etSuggestedName.text.toString())
                }
                else{
                    Snackbar.make(binding.root, "The suggested name must not be empty!", 5).show()
                }
            }
            .setNegativeButton(R.string.button_cancel, null)
            .create()
    }

    private fun isValid(): Boolean {
        return !binding.etSuggestedName.text.toString().isEmpty()
    }
    companion object{
        const val TAG = "SuggestDialogFragment"
    }
}