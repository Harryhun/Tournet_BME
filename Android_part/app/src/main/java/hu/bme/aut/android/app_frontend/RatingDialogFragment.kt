package hu.bme.aut.android.app_frontend

import android.app.AlertDialog
import android.app.Dialog
import android.content.Context
import android.os.Bundle
import androidx.fragment.app.DialogFragment
import hu.bme.aut.android.app_frontend.databinding.FragmentDialogRatingBinding
import java.lang.RuntimeException

class RatingDialogFragment(private val listener: RatingDialogListener, private val defRating: Int, private val oneStar: Int,
    private val twoStar: Int, private val threeStar: Int, private val fourStar: Int, private val fiveStar: Int) : DialogFragment() {

    private lateinit var binding: FragmentDialogRatingBinding

    interface RatingDialogListener{
        fun onRatingChanged(newValue: Int)
    }

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        binding = FragmentDialogRatingBinding.inflate(layoutInflater)
        binding.rbOwnRating.rating = defRating.toFloat()
        binding.tvOneStar.text = oneStar.toString()
        binding.tvTwoStar.text = twoStar.toString()
        binding.tvThreeStar.text = threeStar.toString()
        binding.tvFourStar.text = fourStar.toString()
        binding.tvFiveStar.text = fiveStar.toString()

        return AlertDialog.Builder(requireContext())
            .setTitle(R.string.rate)
            .setView(binding.root)
            .setPositiveButton(R.string.button_ok){ _, _ ->
                listener.onRatingChanged(binding.rbOwnRating.rating.toInt())
            }
            .setNegativeButton(R.string.button_cancel, null)
            .create()
    }

    companion object{
        const val TAG = "RatingDialogFragment"
    }

}