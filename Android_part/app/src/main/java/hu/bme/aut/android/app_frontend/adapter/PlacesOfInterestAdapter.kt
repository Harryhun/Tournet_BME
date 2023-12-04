package hu.bme.aut.android.app_frontend.adapter

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.annotation.DrawableRes
import androidx.recyclerview.widget.RecyclerView
import hu.bme.aut.android.app_frontend.R
import hu.bme.aut.android.app_frontend.data.PlacesOfInterestItem
import hu.bme.aut.android.app_frontend.data.StartMenuItem
import hu.bme.aut.android.app_frontend.databinding.ItemPlacesOfInterestBinding
import java.util.Base64


class PlacesOfInterestAdapter(private val listener: PlacesOfInterestItemClickListener) :
    RecyclerView.Adapter<PlacesOfInterestAdapter.PlacesOfInterestViewHolder>() {
    private val items = mutableListOf<PlacesOfInterestItem>()
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) = PlacesOfInterestViewHolder(
        ItemPlacesOfInterestBinding.inflate(LayoutInflater.from(parent.context), parent, false)
    )
    override fun onBindViewHolder(holder: PlacesOfInterestViewHolder, position: Int) {
        val placeInterestItem = items[position]

        holder.binding.ivIcon.setImageBitmap(getImageResource(placeInterestItem))
        holder.binding.tvName.text = placeInterestItem.name
        holder.binding.tvPrice.text = placeInterestItem.estimatedPrice.toString()
        holder.binding.cvPlaceItem.setOnClickListener{
            listener.onItemSelected(placeInterestItem)
        }

    }
    private fun getImageResource(item: PlacesOfInterestItem): Bitmap {
        val base64Img = item.resPath
        val decodedBytes = Base64.getDecoder().decode(base64Img)
        return BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.size)
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
    fun delete(item: PlacesOfInterestItem){
        items.remove(item)
        notifyDataSetChanged()
    }

    fun deleteAll(){
        items.clear()
        notifyDataSetChanged()
    }

    override fun getItemCount(): Int = items.size

    interface PlacesOfInterestItemClickListener {
        fun onItemChanged(item: PlacesOfInterestItem)
        fun onItemAdded(item: PlacesOfInterestItem)
        fun onDelete(item: PlacesOfInterestItem)

        fun onDeleteAll()

        fun onItemSelected(item: PlacesOfInterestItem)
    }

    inner class PlacesOfInterestViewHolder(val binding: ItemPlacesOfInterestBinding) : RecyclerView.ViewHolder(binding.root)
}