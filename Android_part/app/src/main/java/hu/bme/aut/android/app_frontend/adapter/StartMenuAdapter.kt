package hu.bme.aut.android.app_frontend.adapter

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Log
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import hu.bme.aut.android.app_frontend.data.StartMenuItem
import hu.bme.aut.android.app_frontend.databinding.ItemMenuStartBinding
import java.util.Base64

class StartMenuAdapter(private val listener: StartMenuItemClickListener) :
    RecyclerView.Adapter<StartMenuAdapter.StartMenuViewHolder>() {
    private val items = mutableListOf<StartMenuItem>()
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) = StartMenuViewHolder(
        ItemMenuStartBinding.inflate(LayoutInflater.from(parent.context), parent, false)
    )
    override fun onBindViewHolder(holder: StartMenuViewHolder, position: Int) {
        val startMenuItem = items[position]

        holder.binding.ivIcon.setImageBitmap(getImageResource(startMenuItem))
        holder.binding.tvName.text = startMenuItem.name
        holder.binding.tvRating.text = startMenuItem.rating
        holder.binding.ivIcon.setOnClickListener{
            listener.onItemSelected(startMenuItem)
        }
        if(startMenuItem.recommended) holder.binding.tvRecommended.alpha = 1F

    }
    private fun getImageResource(item: StartMenuItem): Bitmap {
        val base64Img = item.resPath
        val decodedBytes = Base64.getDecoder().decode(base64Img)
        return BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.size)
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

        fun onItemSelected(item: StartMenuItem)
    }

    inner class StartMenuViewHolder(val binding: ItemMenuStartBinding) : RecyclerView.ViewHolder(binding.root)
}