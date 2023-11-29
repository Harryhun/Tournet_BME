package hu.bme.aut.android.app_frontend

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.navigation.fragment.navArgs
import hu.bme.aut.android.app_frontend.data.PlacesOfInterestItem
import hu.bme.aut.android.app_frontend.databinding.FragmentTouristSpotBinding
import java.util.Base64


class TouristSpotFragment : Fragment() {
    private lateinit var binding: FragmentTouristSpotBinding
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
        binding.tvCurrentAvgRating.text = args.avgRating
        binding.tvDescription.text = args.description
    }

    private fun getImageResource(resource: String): Bitmap {
        val decodedBytes = Base64.getDecoder().decode(resource)
        return BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.size)
    }

}