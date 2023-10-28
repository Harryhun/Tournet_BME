package hu.bme.aut.android.app_frontend.data

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "placesOfInterestItem")
data class PlacesOfInterestItem(
    @ColumnInfo(name = "id") @PrimaryKey(autoGenerate = true) var id: Long? = null,
    @ColumnInfo(name = "name") var name: String,
    @ColumnInfo(name = "resPath") var resPath: String,
    @ColumnInfo(name = "description") var description: String,
    @ColumnInfo(name = "estimated_price") var estimatedPrice: Int,
    @ColumnInfo(name = "Visited") var Visited: Boolean,
    @ColumnInfo(name = "Rating") var Rating: Int,
    )