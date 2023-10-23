package hu.bme.aut.android.app_frontend

import android.content.Context
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.Menu
import android.view.MenuItem
import android.view.SubMenu
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import hu.bme.aut.android.app_frontend.adapter.StartMenuAdapter
import hu.bme.aut.android.app_frontend.data.StartMenuItem
import hu.bme.aut.android.app_frontend.data.StartMenuListDatabase
import hu.bme.aut.android.app_frontend.databinding.ActivityStartMenuBinding
import kotlin.concurrent.thread

class StartMenuActivity : AppCompatActivity(), StartMenuAdapter.StartMenuItemClickListener {
    private lateinit var binding: ActivityStartMenuBinding
    private lateinit var database: StartMenuListDatabase
    private lateinit var adapter: StartMenuAdapter
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityStartMenuBinding.inflate(layoutInflater)
        setContentView(binding.root)
        setSupportActionBar(binding.toolbar)
        database = StartMenuListDatabase.getDatabase(this)
        initRecyclerView()
    }
    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        val toolbarMenu: Menu = binding.toolbar.menu
        menuInflater.inflate(R.menu.menu_toolbar, toolbarMenu)
        for (i in 0 until toolbarMenu.size()) {
            val menuItem: MenuItem = toolbarMenu.getItem(i)
            menuItem.setOnMenuItemClickListener { item -> onOptionsItemSelected(item) }
            if (menuItem.hasSubMenu()) {
                val subMenu: SubMenu = menuItem.subMenu!!
                for (j in 0 until subMenu.size()) {
                    subMenu.getItem(j)
                        .setOnMenuItemClickListener { item -> onOptionsItemSelected(item) }
                }
            }
        }
        return super.onCreateOptionsMenu(menu)
    }
    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.menu_profile -> {
                true
            }
            R.id.menu_modify -> {
                true
            }
            R.id.menu_exit -> {
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    private fun initRecyclerView() {
        adapter = StartMenuAdapter(this)
        binding.rvStartMenu.layoutManager = LinearLayoutManager(this)
        binding.rvStartMenu.adapter = adapter
        loadItemsInBackground()
    }
    private fun loadItemsInBackground() {
        thread {
            val items = database.startMenuItemDao().getAll()
            runOnUiThread{
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
            runOnUiThread{
                adapter.addItem(item)
            }
        }
    }
}