package hu.bme.aut.android.app_frontend
import android.os.Bundle
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import android.view.SubMenu
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import hu.bme.aut.android.app_frontend.adapter.PlacesOfInterestAdapter
import hu.bme.aut.android.app_frontend.data.PlacesOfInterestItem
import hu.bme.aut.android.app_frontend.data.PlacesOfInterestListDatabase
import hu.bme.aut.android.app_frontend.databinding.ActivityPlacesOfInterestBinding
import kotlin.concurrent.thread

class PlacesOfInterestActivity : AppCompatActivity(), PlacesOfInterestAdapter.PlacesOfInterestItemClickListener {
    private lateinit var binding: ActivityPlacesOfInterestBinding
    private lateinit var database: PlacesOfInterestListDatabase
    private lateinit var adapter: PlacesOfInterestAdapter
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPlacesOfInterestBinding.inflate(layoutInflater)
        setContentView(binding.root)
        setSupportActionBar(binding.toolbar)
        database = PlacesOfInterestListDatabase.getDatabase(this)
        initRecyclerView()
    }
//    override fun onCreateOptionsMenu(menu: Menu): Boolean {
//        val toolbarMenu: Menu = binding.toolbar.menu
//        menuInflater.inflate(R.menu.places_interest, toolbarMenu)
//        for (i in 0 until toolbarMenu.size()) {
//            val menuItem: MenuItem = toolbarMenu.getItem(i)
//            menuItem.PlacesOfInterestItemClickListener { item -> onOptionsItemSelected(item) }
//            if (menuItem.hasSubMenu()) {
//                val subMenu: SubMenu = menuItem.subMenu!!
//                for (j in 0 until subMenu.size()) {
//                    subMenu.getItem(j)
//                        .PlacesOfInterestItemClickListener { item -> onOptionsItemSelected(item) }
//                }
//            }
//        }
//        return super.onCreateOptionsMenu(menu)
//    }
//    override fun onOptionsItemSelected(item: MenuItem): Boolean {
//        return when (item.itemId) {
//            R.id.menu_profile -> {
//                true
//            }
//            R.id.menu_modify -> {
//                true
//            }
//            R.id.menu_exit -> {
//                true
//            }
//            else -> super.onOptionsItemSelected(item)
//        }
//    }

    private fun initRecyclerView() {
        adapter = PlacesOfInterestAdapter(this)
        binding.rvPlacesOfInterest.layoutManager = LinearLayoutManager(this)
        binding.rvPlacesOfInterest.adapter = adapter
        loadItemsInBackground()
    }
    private fun loadItemsInBackground() {
        thread {
            val items = database.placesOfInterestItemDao().getAll()
            runOnUiThread{
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
            runOnUiThread{
                adapter.addItem(item)
            }
        }
    }
}