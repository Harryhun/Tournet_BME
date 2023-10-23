package hu.bme.aut.android.app_frontend.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(entities = [StartMenuItem::class], version = 1)
abstract class StartMenuListDatabase : RoomDatabase(){
    abstract fun startMenuItemDao() : StartMenuItemDao
    companion object{
        fun getDatabase(applicationContext: Context): StartMenuListDatabase {
            return Room.databaseBuilder(
                applicationContext,
                StartMenuListDatabase::class.java,
                "startmenuitem-list"
            ).build();
        }
    }
}