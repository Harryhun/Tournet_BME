package hu.bme.aut.android.app_frontend

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.Menu
import android.view.MenuItem
import android.view.SubMenu
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.get
import androidx.fragment.app.Fragment
import androidx.navigation.findNavController
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import hu.bme.aut.android.app_frontend.adapter.StartMenuAdapter
import hu.bme.aut.android.app_frontend.apiconnector.AndroidFrontendConnector
import hu.bme.aut.android.app_frontend.data.StartMenuItem
import hu.bme.aut.android.app_frontend.data.StartMenuListDatabase
import hu.bme.aut.android.app_frontend.databinding.FragmentStartMenuBinding
import kotlin.concurrent.thread

class StartMenuFragment : Fragment(), StartMenuAdapter.StartMenuItemClickListener {
    private lateinit var binding: FragmentStartMenuBinding
    private lateinit var database: StartMenuListDatabase
    private lateinit var adapter: StartMenuAdapter
    private var connector = AndroidFrontendConnector()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        binding = FragmentStartMenuBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        database = StartMenuListDatabase.getDatabase(this.requireContext())
        initRecyclerView()
        binding.toolbar.inflateMenu(R.menu.menu_toolbar)

        binding.toolbar.setOnMenuItemClickListener{
            when(it.itemId){
                R.id.menu_profile -> {
                    findNavController().navigate(R.id.action_startMenuFragment_to_showProfilFragment)
                    true
                }
                R.id.menu_exit -> {
                    findNavController().navigate(R.id.action_startMenuFragment_to_placesOfInterestFragment)
                    true
                }
                else -> true
            }
        }
    }

    private fun initRecyclerView() {
        adapter = StartMenuAdapter(this)
        binding.rvStartMenu.layoutManager = LinearLayoutManager(this.requireContext())
        binding.rvStartMenu.adapter = adapter
        loadItemsInBackground()
    }
    private fun loadItemsInBackground() {
        thread {
            val items = database.startMenuItemDao().getAll()

            val data = connector.GetDomains()
            val jsonArray = data.getJSONArray("domains")
            for(i in 0 until jsonArray.length()){
                val obj = jsonArray.getJSONObject(i)
                val newItem = StartMenuItem(null, obj.getInt("id"), obj.getString("name"), obj.getString("rating") , obj.getString("picture"))
                items.add(newItem)
            }
            requireActivity().runOnUiThread{
                adapter.update(items)
            }

        }
    }
    override fun onItemChanged(item: StartMenuItem) {
        thread {
            database.startMenuItemDao().update(item)
            Log.d("StartMenuActivity", "StartMenuItem update was successful")
        }
    }

    override fun onItemAdded(item: StartMenuItem) {
        thread {
            val insertId = database.startMenuItemDao().insert(item)
            item.id = insertId
            requireActivity().runOnUiThread{
                adapter.addItem(item)
            }
        }
    }

    override fun onItemSelected(item: StartMenuItem) {
        val action = StartMenuFragmentDirections.actionStartMenuFragmentToPlacesOfInterestFragment(domainId = item.domainId)
        findNavController().navigate(action)
    }
}