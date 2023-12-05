package hu.bme.aut.android.app_frontend.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(entities = [PlacesOfInterestItem::class], version = 4)
abstract class PlacesOfInterestListDatabase : RoomDatabase(){
    abstract fun placesOfInterestItemDao() : PlacesOfInterestDao
    companion object{
        fun getDatabase(applicationContext: Context): PlacesOfInterestListDatabase {
            return Room.databaseBuilder(
                applicationContext,
                PlacesOfInterestListDatabase::class.java,
                "placesofinterestitem-list"
            ).fallbackToDestructiveMigration()
                .build();
        }
    }
}