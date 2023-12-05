package hu.bme.aut.android.app_frontend.data

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Update

@Dao
interface PlacesOfInterestDao {
    @Query("SELECT * FROM placesOfInterestItem")
    fun getAll(): MutableList<PlacesOfInterestItem>

    @Insert
    fun insert(placesOfInterestItem: PlacesOfInterestItem): Long

    @Update
    fun update(placesOfInterestItem: PlacesOfInterestItem)

    @Delete
    fun deleteItem(placesOfInterestItem: PlacesOfInterestItem)
}