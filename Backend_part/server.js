const express = require('express')
const app = express()
const auth = require('basic-auth')
const { Sequelize } = require('sequelize')

app.use(express.json())

const databaseConn = new Sequelize('tournet', 'admin', 'pass', {
    host: 'localhost',
    dialect: 'mysql'
})

let initModels = require("./models/init-models")
const db = initModels(databaseConn)

console.log("Server started!")

app.post('/login', (req, res) => {
    login(req, res)
})

app.post('/signUp', (req, res) => {
    signUp(req, res)
})

app.post('/forgotPassword', (req, res) => {
    forgotPassword(req, res)
})

//! EMPTY QUERY RESULT ERROR HANDLING

async function login(req, res)
{
    user = auth(req)
    if(user)
    {  
        db.user.findOne({
            where: {
                name: req.body.userName,
                password: req.body.password
            }
        })
        .then((queryRes) => 
        {
            res.json([{
                status: 1, //Sikeres
                userId: queryRes.dataValues.id
            }])
        })
        .catch((err) =>
        {
            res.json([{
                status: 2, //Sikertelen
                userId: null
            }])
        })
    }
    else
    {
        res.status(403).send("Access denied.")
    }
}

async function signUp(req, res)
{
    user = auth(req)
    if(user)
    {           
        db.user.create({
            name: req.body.userName,
            password: req.body.password,
            email: req.body.emailAddress,
            roleId: 3
        })
        .then((queryRes) => {
            db.user.findOne({
                where: {
                    name: req.body.userName,
                    password: req.body.password
                }
            })
            .then((queryRes) => 
            {
                res.json([{
                    status: 1, //Sikeres
                    userId: queryRes.dataValues.id
                }])
            })
            .catch((err) =>
            {
                res.json([{
                    status: 2, //Sikertelen
                    userId: null
                }])
            })
        })
        .catch((err) => {
            res.json([{
                status: 2, //Sikertelen
                userId: null
            }])
        })
    }
    else
    {
        res.status(403).send("Access denied.")
    }
}

async function forgotPassword(req, res)
{
    user = auth(req)
    if(user)
    {        
        db.user.findOne({
            where: {
                email: req.body.emailAddress,
            }
        })
        .then((queryRes) => 
        {
            //---ÚJ TEMP JELSZÓ LÉTREHOZÁSA---
            const crypto = require('crypto')
            const newPass = crypto.randomBytes(5).toString('hex') //Létrehoz egy random 10 számból/hexa betűből álló temp 'jelszót'
            db.user.update({password: newPass}, {
                    where: {
                    email: req.body.emailAddress
                }}
            )
            .then((queryRes2) => {
                //---EMAIL KÜLDÉS (Nodemailer)--- 
                const mailer = require('nodemailer')
                const mailSender = mailer.createTransport(
                {
                    service: 'gmail',
                    auth: {
                        user: 'TournetBMEPassRecovery@gmail.com',
                        pass: 'afeeqdjeczemdkzs'
                    }
                })
                const content = {
                    from: 'TournetBMEPassRecovery@gmail.com',
                    to: req.body.emailAddress,
                    subject: 'TournetBME - Jelszó helyreállítás',
                    text: 'Az új jelszavad: ' + newPass + "\n\nKérjük, hogy a fiókod biztonsága érdekében a következő bejelentkezésnél állíts új jelszót a profilbeállításoknál!"
                }
                mailSender.sendMail(content, (err, data) => {
                    if(err)
                    {
                        res.json([{
                            status: 2, //Sikertelen
                        }])
                        console.log(err)
                    }
                    else
                    {
                        res.json([{
                            status: 1, //Sikeres
                        }])
                    }
                })   
            }) 
            .catch((err) =>
            {
                res.json([{
                    status: 2, //Sikertelen
                }])
            })        
        })
        .catch((err) =>
        {
            res.json([{
                status: 2, //Sikertelen
            }])
        })
    }
    else
    {
        res.status(403).send("Access denied.")
    }
}

app.post('/requestDomains', (req, res) => {

    user = auth(req)
    if(user)
    {   
        //---ADATBÁZIS SELECT (Sequelize?)---
        //let domainList = SELECT * FROM domain
        //!KÉP MEGOLDÁSA (átküldés/referencia)
        
            //SIKERES (.then)
            let domainObjectList = new Array()
            for(let i = 0; i < domainList.length; i++)
            {
                domainObjectList[i] = {}
                domainObjectList[i]['name'] = domainList[i].name
                domainObjectList[i]['rating'] = domainList[i].rating
                domainObjectList[i]['picture'] = domainList[i].picture
            }
            res.json([{
                status: 1, //Sikeres
                domains: JSON.stringify(domainObjectList) 
            }])

            //SIKERTELEN (.catch)
            res.json([{
                status: 2, //Sikertelen
                domains: null
            }])

    }
    else
    {
        res.status(403).send("Access denied.")
    }

})

app.post('/requestPlaces', (req, res) => {

    user = auth(req)
    if(user)
    {   
        //---ADATBÁZIS SELECT (Sequelize?)---
        //PlaceDomainConnectorból megfelelő domainId-jű placeId-k kiszedése -> ezekhez a placeId-khez tartozó szükséges infók kiszedése a Place-ből -> placeList
        
            //SIKERES (.then)
            let placeObjectList = new Array()
            for(let i = 0; i < placeList.length; i++)
            {
                placeObjectList[i] = {}
                placeObjectList[i]['name'] = placeList[i].name
            }
            res.json([{
                status: 1, //Sikeres
                domains: JSON.stringify(placeObjectList) 
            }])

            //SIKERTELEN (.catch)
            res.json([{
                status: 2, //Sikertelen
                domains: null
            }])

    }
    else
    {
        res.status(403).send("Access denied.")
    }

})

app.post('/requestPlaceDetails', (req, res) => {

    user = auth(req)
    if(user)
    {   
        //---ADATBÁZIS SELECT (Sequelize?)---
        //let placeList = SELECT * FROM place WHERE req.placeId = id
        //!KÉP MEGOLDÁSA (átküldés/referencia)
        //!RATING MEGOLDÁSA (rating adatainak kinyerése és egy belső objektumban/listában való eltárolása a placeListen belül)

            //SIKERES (.then)
            let placeObjectList = new Array()
            for(let i = 0; i < placeList.length; i++)
            {
                placeObjectList[i] = {}
                placeObjectList[i]['name'] = placeList[i].name
                placeObjectList[i]['rating'] = placeList[i].rating
                placeObjectList[i]['visitors'] = placeList[i].visitors
                placeObjectList[i]['picture'] = placeList[i].picture
                placeObjectList[i]['description'] = placeList[i].description
                placeObjectList[i]['website'] = placeList[i].website
                placeObjectList[i]['price'] = placeList[i].price
                placeObjectList[i]['latitude'] = placeList[i].latitude
                placeObjectList[i]['longitude'] = placeList[i].longitude
            }
            res.json([{
                status: 1, //Sikeres
                domains: JSON.stringify(placeObjectList) 
            }])

            //SIKERTELEN (.catch)
            res.json([{
                status: 2, //Sikertelen
                domains: null
            }])

    }
    else
    {
        res.status(403).send("Access denied.")
    }

})

app.post('/recieveSuggestion', (req, res) => {

    user = auth(req)
    if(user)
    {   
        //---ADATBÁZIS INSERT (Sequelize?)---
        //INSERT INTO suggestion VALUES(req.domainId, req.userId, req.suggestionName)

            //SIKERES (.then)
            res.json([{
                status: 1, //Sikeres
            }])

            //SIKERTELEN (.catch)
            res.json([{
                status: 2, //Sikertelen
            }])
    }
    else
    {
        res.status(403).send("Access denied.")
    }

})

app.post('/setVisited', (req, res) => {

    user = auth(req)
    if(user)
    {   
        //---ADATBÁZIS INSERT + UPDATE (Sequelize?)---
        //INSERT INTO userplaceconnector VALUES(req.placeId, req.userId, 0)
        //UPDATE place SET visitors = visitors+1 WHERE req.placeId = id //?visitors + 1-hez lehet kell egy extra lekérdezés

            //SIKERES (.then)
            res.json([{
                status: 1, //Sikeres
            }])

            //SIKERTELEN (.catch)
            res.json([{
                status: 2, //Sikertelen
            }])
    }
    else
    {
        res.status(403).send("Access denied.")
    }

})

app.post('/setRating', (req, res) => {

    user = auth(req)
    if(user)
    {   
        //---ADATBÁZIS SELECT + UPDATE (Sequelize?)---
        //let ratingId = SELECT ratingId FROM place WHERE req.placeId = id
        switch(req.ratingValue)
        {
            default: break;
            case 1: //UPDATE rating SET oneStar = oneStar+1 WHERE ratingId = id //?star + 1-hez lehet kell egy extra lekérdezés
            break;
            case 2: //UPDATE rating SET twoStar = twoStar+1 WHERE ratingId = id //?star + 1-hez lehet kell egy extra lekérdezés
            break;
            case 3: //UPDATE rating SET threeStar = threeStar+1 WHERE ratingId = id //?star + 1-hez lehet kell egy extra lekérdezés
            break;
            case 4: //UPDATE rating SET fourStar = fourStar+1 WHERE ratingId = id //?star + 1-hez lehet kell egy extra lekérdezés
            break;
            case 5: //UPDATE rating SET fiveStar = fiveStar+1 WHERE ratingId = id //?star + 1-hez lehet kell egy extra lekérdezés
            break;
        }

            //SIKERES (.then)
            res.json([{
                status: 1, //Sikeres
            }])

            //SIKERTELEN (.catch)
            res.json([{
                status: 2, //Sikertelen
            }])
    }
    else
    {
        res.status(403).send("Access denied.")
    }

})

app.post('/profileUpdate', (req, res) => {

    user = auth(req)
    if(user)
    {   
        //---ADATBÁZIS UPDATE (Sequelize?)---
        switch(req.type)
        {
            default: break;
            case 0: //UPDATE user SET name = req.newInfo WHERE req.userId = id
            break;
            case 1: //UPDATE user SET password = req.newInfo WHERE req.userId = id
            break;
            case 2: //UPDATE user SET email = req.newInfo WHERE req.userId = id
            break;
        }
        
            //SIKERES (.then)
            res.json([{
                status: 1, //Sikeres
            }])

            //SIKERTELEN (.catch)
            res.json([{
                status: 2, //Sikertelen
            }])
    }
    else
    {
        res.status(403).send("Access denied.")
    }

})

app.listen(3000)