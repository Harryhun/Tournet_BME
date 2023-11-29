let roleId = 0
const container = document.getElementById('root')
const root = ReactDOM.createRoot(container)

function LoginScreen() {
    let userName = ""
    let password = ""
    const loginScreenComponents = (
        <div>
            <h1>Tournet BME Admin Interface</h1>
            <h2>Login</h2>
            <form>
                <div>
                    <label for="usernameInput">Username:</label>
                    <input type="text" id="usernameInput" onChange={event => userName = event.target.value} required></input>
                </div>
                <div>
                    <label for="passwordInput">Password:</label>
                    <input type="password" id="passwordInput" onChange={event => password = event.target.value} required></input>
                </div>
            </form>
            <div>
                <button id="loginBtn" onClick={() => LoginValidation(userName, password)}>Login</button>
            </div>
        </div>
    );
    return loginScreenComponents
}

function DisplayMenu()
{
    let menuItems = ["Places", "New Place", "Suggestions"]
    if(roleId == 1)
    {
        menuItems.push("Roles")
    }
    const menuComponents = (
        <ul id="navBar">
            {menuItems.map((menuItem) => <li class="navBarItem" onClick={() => MenuItemSelected(menuItem)}><a href="#">{menuItem}</a></li>)}
        </ul>
    );
    return menuComponents
}

function MenuItemSelected(itemName)
{
   switch(itemName)
   {
      default: break;
      case 'Places': PlacesScreen(); break;
      case 'New Place': NewPlaceScreen(); break;
      case 'Suggestions': SuggestionsScreen(); break;
      case 'Roles': RolesScreen(); break;
   }
}

async function PlacesScreen() {

    let dList = await GetDomains()
    let objectList = []
    for (let i = 0; i < dList.domains.length; i++)
    {
        objectList.push(<h2 class="domainNames">{dList.domains[i].name}</h2>)
        let pList = await GetPlaces(dList.domains[i].id)
        for (let j = 0; j < pList.places.length; j++)
        {
            console.log(pList.places[j])
            objectList.push(
                        <div>
                        <h3 class="placeNames">{pList.places[j].name}</h3>
                        <button onClick={() => EditPlaceScreen(pList.places[j], dList.domains[i].id)}>Edit</button>
                        <button onClick={() => RemovePlace(pList.places[j].id)}>Delete</button>
                        </div>)
        }
    }
    const placesScreenComponents = (
        <div>
        <DisplayMenu />
        <h1>Places</h1>
        { objectList }
        </div>
    );
    root.render(placesScreenComponents)
}

async function NewPlaceScreen(placeName = null, domainId = 1)
{
    let newPlace = new Place(null, null, null, null, null, null, null, null)
    let dList = await GetDomains()
    let domainOptionList = []
    for (let i = 0; i < dList.domains.length; i++) {
        if(dList.domains[i].id == domainId)
        {
            domainOptionList.push(<option selected value={dList.domains[i].id}>{dList.domains[i].name}</option>)
        }
        else
        {
            domainOptionList.push(<option value={dList.domains[i].id}>{dList.domains[i].name}</option>)
        }
    }
    const newPlaceScreenComponents = (
        <div>
        <DisplayMenu />
        <h1>Add New Place</h1>
            <form>
                <div>
                    <label for="nameInput">Name:</label>
                    <input type="text" id="nameInput" placeholder={placeName} onChange={event => newPlace.name = event.target.value} required></input>
                </div>
                <div>
                    <label for="domainInput">Domain:</label>
                    <select id="domainInput" onChange={event => newPlace.domainId = event.target.value}>
                        {domainOptionList}
                    </select>
                </div>
                <div>
                    <label for="picInput">Picture:</label>
                    <input type="file" id="picInput" accept="image/*" onChange={event => newPlace.picture = event.target.value} required></input>
                </div>
                <div>
                    <label for="descInput">Description:</label>
                    <textarea id="descInput" onChange={event => newPlace.description = event.target.value} required></textarea>
                </div>
                <div>
                    <label for="webInput">Website:</label>
                    <input type="text" id="webInput" onChange={event => newPlace.website = event.target.value} required></input>
                </div>
                <div>
                    <label for="priceInput">Price:</label>
                    <input type="number" id="priceInput" onChange={event => newPlace.price = event.target.value} required></input>
                </div>
                <div>
                    <label for="latInput">Latitude:</label>
                    <input type="number" id="latInput" onChange={event => newPlace.latitude = event.target.value} required></input>
                    <label for="longInput">Longitude:</label>
                    <input type="number" id="longInput" onChange={event => newPlace.longitude = event.target.value} required></input>
                </div>
            </form>
            <div>
                <button id="newPlaceBtn" onClick={() => PlaceValidation(newPlace)}>Add Place</button>
            </div>
        </div>
    );
    root.render(newPlaceScreenComponents)
}

async function SuggestionsScreen()
{
    let dList = await GetDomains()
    let objectList = []
    for (let i = 0; i < dList.domains.length; i++)
    {
        let sList = await GetSuggestions(dList.domains[i].id)
        if(sList.suggestions.length != 0)
        {
            objectList.push(<h2 class="domainNames">{dList.domains[i].name}</h2>)
            for (let j = 0; j < sList.suggestions.length; j++)
            {
                objectList.push(
                        <div>
                            <h3 class="suggestionNames">{sList.suggestions[j].suggestion}</h3>
                            <p class="suggestionOwner">{sList.suggestions[j].user}</p>
                            <button onClick={() => AcceptSuggestion(sList.suggestions[j])}>Accept</button>
                            <button onClick={() => DeclineSuggestion(sList.suggestions[j].id)}>Decline</button>
                        </div>)
            }
        }
    }
    const suggestionScreenComponents = (
        <div>
        <DisplayMenu />
        <h1>Suggestions</h1>
        { objectList }
        </div>
    );
    root.render(suggestionScreenComponents)
}

async function RolesScreen()
{
    let uList = await GetUsers()
    let userList = []
    let roles = ["Admin", "Editor", "User"]
    let promotedemoteText = ["Demote", "Promote"]
    for (let i = 0; i < uList.users.length; i++)
    {
        if(uList.users[i].roleId == 1)
        {
            userList.push(<div>
                <h2 class="userNames">{uList.users[i].name}</h2>
                <p class="userRole">{roles[uList.users[i].roleId-1]}</p>
              </div>)
        }
        else
        {
            userList.push(<div>
                <h2 class="userNames">{uList.users[i].name}</h2>
                <p class="userRole">{roles[uList.users[i].roleId-1]}</p>
                <button onClick={() => ChangeRole(uList.users[i])}>{promotedemoteText[uList.users[i].roleId-2]}</button>
              </div>)
        }
    }
    const rolesScreenComponents = (
        <div>
        <DisplayMenu />
        <h1>Users</h1>
        {userList}
        </div>
    );
    root.render(rolesScreenComponents)
}

async function EditPlaceScreen(place, domainId)
{
    let editPlace = new Place(place.name, domainId, place.picture, place.description, place.website, place.price, place.latitude, place.longitude, place.id)
    let dList = await GetDomains()
    let domainOptionList = []
    for (let i = 0; i < dList.domains.length; i++) {
        if(dList.domains[i].id == domainId)
        {
            domainOptionList.push(<option selected value={dList.domains[i].id}>{dList.domains[i].name}</option>)
        }
        else
        {
            domainOptionList.push(<option disabled value={dList.domains[i].id}>{dList.domains[i].name}</option>)
        }
    }
    const editPlaceScreenComponents = (
        <div>
        <DisplayMenu />
        <h1>Edit Place</h1>
            <form>
                <div>
                    <label for="nameInput">Name:</label>
                    <input type="text" id="nameInput" placeholder={place.name} onChange={event => editPlace.name = event.target.value} required></input>
                </div>
                <div>
                    <label for="domainInput">Domain:</label>
                    <select id="domainInput" onChange={event => editPlace.domainId = event.target.value}>
                        {domainOptionList}
                    </select>
                </div>
                <div>
                    <label for="picInput">Picture:</label>
                    <input type="file" id="picInput" accept="image/*" onChange={event => editPlace.picture = event.target.value} required></input>
                </div>
                <div>
                    <label for="descInput">Description:</label>
                    <textarea id="descInput" onChange={event => editPlace.description = event.target.value} required>{place.description}</textarea>
                </div>
                <div>
                    <label for="webInput">Website:</label>
                    <input type="text" id="webInput" placeholder={place.website} onChange={event => editPlace.website = event.target.value} required></input>
                </div>
                <div>
                    <label for="priceInput">Price:</label>
                    <input type="number" id="priceInput" placeholder={place.price} onChange={event => editPlace.price = event.target.value} required></input>
                </div>
                <div>
                    <label for="latInput">Latitude:</label>
                    <input type="number" id="latInput" placeholder={place.latitude} onChange={event => editPlace.latitude = event.target.value} required></input>
                    <label for="longInput">Longitude:</label>
                    <input type="number" id="longInput" placeholder={place.longitude} onChange={event => editPlace.longitude = event.target.value} required></input>
                </div>
            </form>
            <div>
                <button id="editPlaceBtn" onClick={() => PlaceEditValidation(editPlace)}>Edit Place</button>
            </div>
        </div>
    );
    root.render(editPlaceScreenComponents)
}

async function LoginValidation(userName, password)
{
  const loginRes = await Login(userName, password)
  if(loginRes.status == 1 && loginRes.roleId < 3)
  {
    roleId = loginRes.roleId
    PlacesScreen()
  }
  //TODO nincs ilyen felh / user a felhasználó
}

async function PlaceEditValidation(editPlace)
{
    //TODO PICTURE XD
    const editRes = await EditPlace(editPlace)
    if(editRes.status == 1)
    {
        PlacesScreen()
    }
    //TODO validation?
}

async function PlaceValidation(newPlace)
{
    newPlace.picture = "baz.png" //TODO PICTURE XD
    const addRes = await AddPlace(newPlace)
    if(addRes.status == 1)
    {
        PlacesScreen()
    }
    //TODO validation?
}

async function ChangeRole(user)
{
    let roleRes 
    if(user.roleId == 2)
    {
        roleRes = await SetUserRole(user.id, 3)
    }
    else if (user.roleId == 3)
    {
        roleRes = await SetUserRole(user.id, 2)
    }
    if(roleRes.status == 1)
    {
        RolesScreen()
    }
}
async function DeclineSuggestion(suggId)
{
    const suggRes = await DeleteSuggestion(suggId)
    if(suggRes.status == 1)
    {
        SuggestionsScreen()
    }
}

async function AcceptSuggestion(suggestion)
{
    const suggRes = await DeleteSuggestion(suggestion.id)
    if(suggRes.status == 1)
    {
        NewPlaceScreen(suggestion.suggestion, suggestion.domainId)
    }
}

async function RemovePlace(placeId)
{
    const placeRes = await DeletePlace(placeId)
    if(placeRes.status == 1)
    {
        PlacesScreen()
    }
}

root.render(<LoginScreen />)