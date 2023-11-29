const url = "http://localhost:3000"
let userId = 0

class Place
{
    constructor(name, domainId, picture, description, website, price, latitude, longitude, id = 0)
    {
        this.name = name;
        this.domainId = domainId;
        this.picture = picture;
        this.description = description;
        this.website = website;
        this.price = price;
        this.latitude = latitude;
        this.longitude = longitude;
        this.id = id;
    }
}

async function POST(commandName, data)
{
    const res = await fetch(url + commandName, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Authorization": "Basic " + btoa("user:pass")
        }
    })
    if(res == null)
    {
        const emptyRes =
        {
            status: -1,
        }
        return emptyRes
    }
    return await res.json()
}

async function Login(userName, password)
{
    const loginInfo =
    {
        userName: userName,
        password: password
    }
    return await POST('/login', loginInfo)
}

async function GetDomains()
{
    const domainInfo = 
    {
        empty: "empty"
    }
    return await POST('/requestDomains', domainInfo)
}

async function GetPlaces(domainId)
{
    const placesInfo = 
    {
        domainId: domainId
    }
    return await POST('/requestPlaces', placesInfo)
}

async function AddPlace(placeAdded)
{
    const placeInfo = 
    {
        name: placeAdded.name,
        domainId: placeAdded.domainId,
        picture: placeAdded.picture,
        description: placeAdded.description,
        website: placeAdded.website,
        price: placeAdded.price,
        latitude: placeAdded.latitude,
        longitude: placeAdded.longitude
    }
    return await POST('/addPlace', placeInfo)
}

async function EditPlace(placeEdited)
{
    const placeInfo = 
    {
        id: placeEdited.id,
        name: placeEdited.name,
        domainId: placeEdited.domainId,
        picture: placeEdited.picture,
        description: placeEdited.description,
        website: placeEdited.website,
        price: placeEdited.price,
        latitude: placeEdited.latitude,
        longitude: placeEdited.longitude
    }
    return await POST('/editPlace', placeInfo)
}

async function DeletePlace(placeId)
{
    const placeInfo = 
    {
        id: placeId
    }
    return await POST('/deletePlace', placeInfo)
}

async function GetSuggestions(domainId)
{
    const suggestionInfo = 
    {
        domainId: domainId
    }
    return await POST('/requestSuggestions', suggestionInfo)
}

async function DeleteSuggestion(suggestionId)
{
    const suggestionInfo = 
    {
        suggestionId: suggestionId
    }
    return await POST('/deleteSuggestion', suggestionInfo)
}

async function GetUsers()
{
    const userInfo = 
    {
        empty: "empty"
    }
    return await POST('/requestUsers', userInfo)
}

async function SetUserRole(userId, newRoleId)
{
    const userInfo =
    {
        userId: userId,
        newRoleId: newRoleId
    }
    return await POST('/setUserRole', userInfo)
}