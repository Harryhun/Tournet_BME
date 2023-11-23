let roleId = 0
const container = document.getElementById('root')
const root = ReactDOM.createRoot(container)

let userName = ""
let password = ""

function LoginScreen() {
    const loginScreenComponents = (
        <div>
            <h1>Tournet BME Kezelőfelület</h1>
            <h2>Bejelentkezés</h2>
            <form>
                <div>
                    <label for="usernameInput">Felhasználónév:</label>
                    <input type="text" id="usernameInput" onChange={event => userName = event.target.value} required></input>
                </div>
                <div>
                    <label for="passwordInput">Jelszó:</label>
                    <input type="password" id="passwordInput" onChange={event => password = event.target.value} required></input>
                </div>
            </form>
            <div>
                <button id="loginBtn" value="Bejelentkezés" onClick={LoginValidation}>Bejelentkezés</button>
            </div>
        </div>
    );
    return loginScreenComponents
}

function DisplayMenu()
{
    let menuItems = ["Helyek", "Új hely", "Ajánlások"]
    if(roleId == 1)
    {
        menuItems.push("Jogosultságok")
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
      case 'Helyek': PlacesScreen(); break;
      case 'Új hely': NewPlaceScreen(); break;
      case 'Ajánlások': SuggestionsScreen(); break;
      case 'Jogosultságok': RolesScreen(); break;
   }
}

function PlacesScreen() {

    const placesScreenComponents = (
        <div>
        <DisplayMenu />
        <p>Itt lesz egy lista ahol megtalálható az összes helyszín domainek szerint kategorizálva. A listaelemek kattinthatók, kattintás után átirányítódunk egy olyan oldalra, ahol az adott helyszínt módosíthatjuk/törölhetjük.</p>
        </div>
    );
    root.render(placesScreenComponents)
}

function NewPlaceScreen()
{
    const newPlaceScreenComponents = (
        <div>
        <DisplayMenu />
        <p>Itt lehet majd hozzáadni új helyszínt az adatbázishoz.</p>
        </div>
    );
    root.render(newPlaceScreenComponents)
}

function SuggestionsScreen()
{
    const suggestionScreenComponents = (
        <div>
        <DisplayMenu />
        <p>Itt lehet majd végignézni és elfogadni/elutasítani az összes felhasználói suggestion-t.</p>
        </div>
    );
    root.render(suggestionScreenComponents)
}

function RolesScreen()
{
    const rolesScreenComponents = (
        <div>
        <DisplayMenu />
        <p>Itt lehet majd kezelni a felhasználók role-jait.</p>
        </div>
    );
    root.render(rolesScreenComponents)
}

async function LoginValidation()
{
  const loginRes = await Login(userName, password)
  if(loginRes.status == 1 && loginRes.roleId != 3)
  {
    roleId = loginRes.roleId
    PlacesScreen()
  }
  //TODO nincs ilyen felh / user a felhasználó
  let placeAdd = new Place("új hely up2", 2 ,"ujpic.png", "ez egy új hely IGEN", "https://www.ujhely.hu", 50000, 50.01, 0.01)
  console.log(DeletePlace(6))
}

root.render(<LoginScreen />)