package hu.bme.aut.android.app_frontend.data

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "startmenuitem")
data class StartMenuItem(
    @ColumnInfo(name = "id") @PrimaryKey(autoGenerate = true) var id: Long? = null,
    @ColumnInfo(name = "domainId") var domainId: Int,
    @ColumnInfo(name = "name") var name: String,
    @ColumnInfo(name = "rating") var rating: String,
    @ColumnInfo(name = "resPath") var resPath: String,
    @ColumnInfo(name = "recommended") var recommended: Boolean,
)
