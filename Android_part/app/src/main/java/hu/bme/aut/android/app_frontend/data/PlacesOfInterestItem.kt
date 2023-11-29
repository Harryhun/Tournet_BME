package hu.bme.aut.android.app_frontend.data

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "placesOfInterestItem")
data class PlacesOfInterestItem(
    @ColumnInfo(name = "id") @PrimaryKey(autoGenerate = true) var id: Long? = null,
    @ColumnInfo(name = "name") var name: String,
    @ColumnInfo(name = "ratingOneStar") var ratingOneStar: Int,
    @ColumnInfo(name = "ratingTwoStar") var ratingTwoStar: Int,
    @ColumnInfo(name = "ratingThreeStar") var ratingThreeStar: Int,
    @ColumnInfo(name = "ratingFourStar") var ratingFourStar: Int,
    @ColumnInfo(name = "ratingFiveStar") var ratingFiveStar: Int,
    @ColumnInfo(name = "visitors") var visitors: Int,
    @ColumnInfo(name = "resPath") var resPath: String,
    @ColumnInfo(name = "description") var description: String,
    @ColumnInfo(name = "website") var webSite: String,
    @ColumnInfo(name = "estimated_price") var estimatedPrice: Int,
    )