package hu.bme.aut.android.app_frontend
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.NavArgs
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import hu.bme.aut.android.app_frontend.adapter.PlacesOfInterestAdapter
import hu.bme.aut.android.app_frontend.apiconnector.AndroidFrontendConnector
import hu.bme.aut.android.app_frontend.data.PlacesOfInterestItem
import hu.bme.aut.android.app_frontend.data.PlacesOfInterestListDatabase
import hu.bme.aut.android.app_frontend.data.StartMenuItem
import hu.bme.aut.android.app_frontend.databinding.FragmentPlacesOfInterestBinding
import kotlin.concurrent.thread

class PlacesOfInterestFragment : Fragment(), PlacesOfInterestAdapter.PlacesOfInterestItemClickListener {
    private lateinit var binding: FragmentPlacesOfInterestBinding
    private lateinit var database: PlacesOfInterestListDatabase
    private lateinit var adapter: PlacesOfInterestAdapter
    private val connector = AndroidFrontendConnector()
    private val args: PlacesOfInterestFragmentArgs by navArgs()


    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        binding = FragmentPlacesOfInterestBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        database = PlacesOfInterestListDatabase.getDatabase(this.requireContext())
        initRecyclerView()
        binding.toolbar.inflateMenu(R.menu.menu_places_interest)


        binding.toolbar.setOnMenuItemClickListener{
            when(it.itemId){
                R.id.menu_profile -> {
                    findNavController().navigate(R.id.action_placesOfInterestFragment_to_showProfilFragment)
                    true
                }
                R.id.menu_exit -> {
                    findNavController().navigate(R.id.action_placesOfInterestFragment_to_loginFragment)


                    true
                }
                else -> true
            }
        }



    }

    private fun initRecyclerView() {
        adapter = PlacesOfInterestAdapter(this)
        binding.rvPlacesOfInterest.layoutManager = LinearLayoutManager(this.requireContext())
        binding.rvPlacesOfInterest.adapter = adapter
        loadItemsInBackground()
    }
    private fun loadItemsInBackground() {
        thread {
            val items = database.placesOfInterestItemDao().getAll()
            val data = connector.GetPlaces(args.domainId)
            val jsonArray = data.getJSONArray("places")
            for(i in 0 until jsonArray.length()){
                val obj = jsonArray.getJSONObject(i)
                val detailedRating = obj.getJSONObject("rating")
                Log.d("RATING", detailedRating.toString())
                val newItem = PlacesOfInterestItem(null, obj.getString("name"), detailedRating.getInt("oneStar"), detailedRating.getInt("twoStar"),
                    detailedRating.getInt("threeStar"), detailedRating.getInt("fourStar"), detailedRating.getInt("fiveStar"), obj.getInt("visitors"),
                    obj.getString("picture"), obj.getString("description"), obj.getString("website"), obj.getInt("price"))
                items.add(newItem)
            }
            requireActivity().runOnUiThread{
                adapter.update(items)
            }
        }
    }
    override fun onItemChanged(item: PlacesOfInterestItem) {
        thread {
            database.placesOfInterestItemDao().update(item)
            Log.d("PlaceInterestActivity", "PlaceInterestActivity update was successful")
        }
    }

    override fun onItemAdded(item: PlacesOfInterestItem) {
        thread {
            val insertId = database.placesOfInterestItemDao().insert(item)
            item.id = insertId
            requireActivity().runOnUiThread{
                adapter.addItem(item)
            }
        }
    }

    override fun onItemSelected(item: PlacesOfInterestItem) {
        val action = PlacesOfInterestFragmentDirections.actionPlacesOfInterestFragmentToTouristSpotFragment(name = item.name, resPath = item.resPath,
            website = item.webSite, price = item.estimatedPrice.toString(), avgRating = calculateRating(item), description = item.description)
        findNavController().navigate(action)
    }

    private fun calculateRating(item: PlacesOfInterestItem): String{
        return ((item.ratingOneStar + item.ratingTwoStar*2 + item.ratingThreeStar*3 + item.ratingFourStar*4 + item.ratingFiveStar*5).toDouble()/
                (item.ratingOneStar + item.ratingTwoStar + item.ratingThreeStar + item.ratingFourStar + item.ratingFiveStar)).toString()
    }
}