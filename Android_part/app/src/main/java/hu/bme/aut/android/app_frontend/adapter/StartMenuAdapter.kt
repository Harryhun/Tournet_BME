package hu.bme.aut.android.app_frontend.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.annotation.DrawableRes
import androidx.recyclerview.widget.RecyclerView
import hu.bme.aut.android.app_frontend.R
import hu.bme.aut.android.app_frontend.data.StartMenuItem
import hu.bme.aut.android.app_frontend.databinding.ItemMenuStartBinding

class StartMenuAdapter(private val listener: StartMenuItemClickListener) :
    RecyclerView.Adapter<StartMenuAdapter.StartMenuViewHolder>() {
    private val items = mutableListOf<StartMenuItem>()
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) = StartMenuViewHolder(
        ItemMenuStartBinding.inflate(LayoutInflater.from(parent.context), parent, false)
    )
    override fun onBindViewHolder(holder: StartMenuViewHolder, position: Int) {
        val startMenuItem = items[position]

        holder.binding.bIcon.setBackgroundResource(getImageResource(startMenuItem.name))

    }
    @DrawableRes
    private fun getImageResource(name: String): Int{
        return R.drawable.baranya
    }
    fun addItem(item: StartMenuItem) {
        items.add(item)
        notifyItemInserted(items.size - 1)
    }

    fun update(regions: List<StartMenuItem>) {
        items.clear()
        items.addAll(regions)
        notifyDataSetChanged()
    }

    override fun getItemCount(): Int = items.size

    interface StartMenuItemClickListener {
        fun onItemChanged(item: StartMenuItem)
        fun onItemAdded(item: StartMenuItem)
    }

    inner class StartMenuViewHolder(val binding: ItemMenuStartBinding) : RecyclerView.ViewHolder(binding.root)
}