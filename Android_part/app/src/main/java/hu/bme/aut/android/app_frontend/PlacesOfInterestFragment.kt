package hu.bme.aut.android.app_frontend
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import hu.bme.aut.android.app_frontend.adapter.PlacesOfInterestAdapter
import hu.bme.aut.android.app_frontend.apiconnector.AndroidFrontendConnector
import hu.bme.aut.android.app_frontend.data.PlacesOfInterestItem
import hu.bme.aut.android.app_frontend.data.PlacesOfInterestListDatabase
import hu.bme.aut.android.app_frontend.databinding.FragmentPlacesOfInterestBinding
import kotlin.concurrent.thread

class PlacesOfInterestFragment : Fragment(), PlacesOfInterestAdapter.PlacesOfInterestItemClickListener, SuggestDialogFragment.SuggestDialogListener {
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
                    val action = PlacesOfInterestFragmentDirections.actionPlacesOfInterestFragmentToShowProfilFragment("Places")
                    findNavController().navigate(action)
                    true
                }
                R.id.menu_suggest -> {
                    SuggestDialogFragment(this).show(
                        childFragmentManager,
                        SuggestDialogFragment.TAG
                    )
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
                val userRating = connector.GetUserRating(obj.getInt("id"))
                Log.d("RATING", userRating.toString())
                var visited = false
                if(userRating.getInt("status") != 0) visited = true
                Log.d("VISITED", visited.toString())
                val newItem = PlacesOfInterestItem(null, obj.getInt("id") ,obj.getString("name"), detailedRating.getInt("oneStar"),
                    detailedRating.getInt("twoStar"), detailedRating.getInt("threeStar"), detailedRating.getInt("fourStar"),
                    detailedRating.getInt("fiveStar"), obj.getInt("visitors"), obj.getString("picture"), obj.getString("description"),
                    obj.getString("website"), obj.getInt("price"), visited)
                val predicate: (PlacesOfInterestItem) -> Boolean = { it.name == newItem.name }
                if(items.any(predicate)){
                    for(item in items){
                        if(item.name == newItem.name){
                            onDelete(item)
                            items.remove(item)
                            onItemAdded(newItem)
                            items.add(newItem)
                            break
                        }
                    }
                }else{
                    items.add(newItem)
                }
            }

            requireActivity().runOnUiThread{
                adapter.update(items)
            }
        }
    }
    override fun onItemChanged(item: PlacesOfInterestItem) {
        thread {
            database.placesOfInterestItemDao().update(item)
            Log.d("PlacesOfInterestFragment", "PlacesOfInterestFragment update was successful")
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

    override fun onDelete(item: PlacesOfInterestItem) {
        thread {
            database.placesOfInterestItemDao().deleteItem(item)
            requireActivity().runOnUiThread{
                adapter.delete(item)
            }
        }
    }

    override fun onDeleteAll() {
        thread {
            val items = database.placesOfInterestItemDao().getAll()
            for(item in items){
                database.placesOfInterestItemDao().deleteItem(item)
            }
            requireActivity().runOnUiThread{
                adapter.deleteAll()
            }
        }
    }

    override fun onItemSelected(item: PlacesOfInterestItem) {
        val action = PlacesOfInterestFragmentDirections.actionPlacesOfInterestFragmentToTouristSpotFragment(name = item.name, resPath = item.resPath,
            website = item.webSite, price = item.estimatedPrice.toString(), description = item.description,
            visitedNumber = item.visitors.toString(), id = item.itemId, visited = item.visited, ratingOneStar = item.ratingOneStar,
            ratingTwoStar = item.ratingTwoStar, ratingThreeStar = item.ratingThreeStar, ratingFourStar = item.ratingFourStar,
            ratingFiveStar = item.ratingFiveStar)
        findNavController().navigate(action)
    }

    override fun onSuggestionMade(name: String) {
        val info = connector.SendSuggestion(args.domainId, name)
        Log.d("STATUSOFSUGGESTION", info.toString())
    }
}