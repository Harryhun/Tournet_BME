package hu.bme.aut.android.app_frontend.apiconnector

import okhttp3.Credentials
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.LinkedBlockingQueue

class AndroidFrontendConnector {
    private val client = OkHttpClient()
    private val url = "http://10.0.2.2:3000"
    private val json_media = "application/json".toMediaType()
    private var userId: Int = -1

    private fun POST(commandName: String, data: String): JSONObject {
        var result: String? = "0"
        val queue = LinkedBlockingQueue<Int>()
        Thread {
            var req = Request.Builder()
                .url(url + commandName)
                .addHeader("Authorization", Credentials.basic("user", "pass"))
                .post(data.toRequestBody(json_media))
                .build()
            result = client.newCall(req).execute().body?.string() //must contain status key
            queue.add(1)
        }.start()
        queue.take()
        if (result == null) {
            var jObject = JSONObject()
            jObject.put("status", 0)
            return jObject
        }
        return JSONObject(result)
    }

    public fun Login(userName: String, password: String): JSONObject {
        var loginInfo = JSONObject()
        loginInfo.put("userName", userName)
        loginInfo.put("password", password)
        val result = POST("/login", loginInfo.toString())
        if (result.getInt("status") == 1) {
            userId = result.getInt("userId")
        }
        return result
    }

    public fun SignUp(userName: String, password: String, emailAddress: String): JSONObject {
        var signUpInfo = JSONObject()
        signUpInfo.put("userName", userName)
        signUpInfo.put("password", password)
        signUpInfo.put("emailAddress", emailAddress)
        var result = POST("/signUp", signUpInfo.toString())
        if (result.getInt("status") == 1) {
            userId = result.getInt("userId")
        }
        return result
    }

    public fun ForgotPassword(emailAddress: String): JSONObject {
        var forgotPasswordInfo = JSONObject()
        forgotPasswordInfo.put("emailAddress", emailAddress)
        return POST("/forgotPassword", forgotPasswordInfo.toString())
    }

    public fun GetDomains(): JSONObject {
        var domainInfo = JSONObject()
        domainInfo.put("empty", "empty")
        return POST("/requestDomains", domainInfo.toString())
    }

    public fun GetPlaces(domainId: Int): JSONObject {
        var placesInfo = JSONObject()
        placesInfo.put("domainId", domainId)
        return POST("/requestPlaces", placesInfo.toString())
    }

    public fun GetPlaceDetails(placeId: Int): JSONObject {
        var placeInfo = JSONObject()
        placeInfo.put("placeId", placeId)
        return POST("/requestPlaceDetails", placeInfo.toString())
    }

    public fun SendSuggestion(domainId: Int, suggestionName: String): JSONObject {
        var suggestionInfo = JSONObject()
        suggestionInfo.put("domainId", domainId)
        suggestionInfo.put("suggestionName", suggestionName)
        return POST("/recieveSuggestion", suggestionInfo.toString())
    }

    public fun SetVisited(placeId: Int): JSONObject {
        var visitInfo = JSONObject()
        visitInfo.put("userId", userId)
        visitInfo.put("placeId", placeId)
        return POST("/setVisited", visitInfo.toString())
    }

    public fun SetRating(placeId: Int, ratingValue: Int): JSONObject {
        var ratingInfo = JSONObject()
        ratingInfo.put("userId", userId)
        ratingInfo.put("placeId", placeId)
        ratingInfo.put("ratingValue", ratingValue)
        return POST("/setRating", ratingInfo.toString())
    }

    //tpye: név = 0, jelszó = 1, email = 2
    public fun UpdateProfile(type: Int, newInfo: String): JSONObject {
        var updateInfo = JSONObject()
        updateInfo.put("userId", userId)
        updateInfo.put("type", type)
        updateInfo.put("newInfo", newInfo)
        return POST("/profileUpdate", updateInfo.toString())
    }
}
