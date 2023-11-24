package hu.bme.aut.android.app_frontend.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.annotation.DrawableRes
import androidx.recyclerview.widget.RecyclerView
import hu.bme.aut.android.app_frontend.R
import hu.bme.aut.android.app_frontend.data.PlacesOfInterestItem
import hu.bme.aut.android.app_frontend.databinding.ItemPlacesOfInterestBinding


class PlacesOfInterestAdapter(private val listener: PlacesOfInterestItemClickListener) :
    RecyclerView.Adapter<PlacesOfInterestAdapter.PlacesOfInterestViewHolder>() {
    private val items = mutableListOf<PlacesOfInterestItem>()
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) = PlacesOfInterestViewHolder(
        ItemPlacesOfInterestBinding.inflate(LayoutInflater.from(parent.context), parent, false)
    )
    override fun onBindViewHolder(holder: PlacesOfInterestViewHolder, position: Int) {
        val placeInterestItem = items[position]

        holder.binding.ivIcon.setBackgroundResource(getImageResource(placeInterestItem.name))


    }
    @DrawableRes
    private fun getImageResource(name: String): Int{
        return R.drawable.baranya
    }
    fun addItem(item: PlacesOfInterestItem) {
        items.add(item)
        notifyItemInserted(items.size - 1)
    }

    fun update(regions: List<PlacesOfInterestItem>) {
        items.clear()
        items.addAll(regions)
        notifyDataSetChanged()
    }

    override fun getItemCount(): Int = items.size

    interface PlacesOfInterestItemClickListener {
        fun onItemChanged(item: PlacesOfInterestItem)
        fun onItemAdded(item: PlacesOfInterestItem)
    }

    inner class PlacesOfInterestViewHolder(val binding: ItemPlacesOfInterestBinding) : RecyclerView.ViewHolder(binding.root)
}