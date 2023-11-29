package hu.bme.aut.android.app_frontend.data

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Update

@Dao
interface StartMenuItemDao {
    @Query("SELECT * FROM startmenuitem")
    fun getAll(): MutableList<StartMenuItem>

    @Insert
    fun insert(shoppingItems: StartMenuItem): Long

    @Update
    fun update(shoppingItem: StartMenuItem)

    @Delete
    fun deleteItem(shoppingItem: StartMenuItem)
}