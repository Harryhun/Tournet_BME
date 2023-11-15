const url = "http://localhost:3000"
let userId = 0

async function Login(userName, password)
{
    const loginInfo = {
        userName: userName,
        password: password
    }
    return await POST('/login', loginInfo)

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
        const emptyRes = {
            status: -1,
        }
        return emptyRes
    }
    return await res.json()

}