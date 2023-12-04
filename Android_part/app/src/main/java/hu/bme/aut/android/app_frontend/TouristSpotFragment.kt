package hu.bme.aut.android.app_frontend

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Color
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.navigation.fragment.navArgs
import com.google.android.material.snackbar.Snackbar
import hu.bme.aut.android.app_frontend.apiconnector.AndroidFrontendConnector
import hu.bme.aut.android.app_frontend.data.PlacesOfInterestItem
import hu.bme.aut.android.app_frontend.databinding.FragmentTouristSpotBinding
import java.util.Base64


class TouristSpotFragment : Fragment(), RatingDialogFragment.RatingDialogListener{
    private lateinit var binding: FragmentTouristSpotBinding
    private val connector = AndroidFrontendConnector()
    private val args: TouristSpotFragmentArgs by navArgs()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        binding = FragmentTouristSpotBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.ivTouristSpot.setImageBitmap(getImageResource(args.resPath))
        binding.tvTouristSpotName.text = args.name
        binding.tvURL.text = args.website
        binding.tvCurrentPrice.text = args.price
        binding.tvCurrentAvgRating.text = calculateRating(args.ratingOneStar, args.ratingTwoStar, args.ratingThreeStar, args.ratingFourStar, args.ratingFiveStar)
        binding.tvDescription.text = args.description
        binding.tvVisitedNumber.text = args.visitedNumber
        binding.tbVisited.isChecked = args.visited

        binding.tbVisited.setOnCheckedChangeListener{ _, _ ->
            connector.SetVisited(args.id)
        }

        binding.btRate.setOnClickListener{
            val rating = connector.GetUserRating(args.id)
            if(rating.getInt("status") != 0){
                val ratingValue = rating.getInt("ratingValue")
                RatingDialogFragment(this, ratingValue, args.ratingOneStar, args.ratingTwoStar, args.ratingThreeStar,
                    args.ratingFourStar, args.ratingFiveStar).show(
                    childFragmentManager,
                    RatingDialogFragment.TAG
                )
            }
            else{
                Toast.makeText(requireContext(), "You can't rate a place you haven't visited yet.", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun getImageResource(resource: String): Bitmap {
        val decodedBytes = Base64.getDecoder().decode(resource)
        return BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.size)
    }

    override fun onRatingChanged(newValue: Int) {
        connector.SetRating(args.id, newValue)
    }

    private fun calculateRating(oneStar: Int, twoStar: Int, threeStar: Int, fourStar: Int, fiveStar: Int): String{
        return ((oneStar + twoStar*2 + threeStar*3 + fourStar*4 + fiveStar*5).toDouble()/
                (oneStar + twoStar + threeStar + fourStar + fiveStar)).toString()
    }

}