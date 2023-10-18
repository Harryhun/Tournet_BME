const express = require('express')
const app = express()

const auth = require('basic-auth')

console.log("Server started!")

app.post('/login', (req, res) => {

    user = auth(req)
    if(user)
    {   
        //---ADATBÁZIS SELECT (Sequelize?)---
        //const userId = SELECT userID FROM user WHERE req.userName = name AND req.password = password
        
            //SIKERES (.then)
            res.json([{
                status: 1, //Sikeres
                userId: userId 
            }])

            //SIKERTELEN (.catch)
            res.json([{
                status: 2, //Sikertelen
                userId: null
            }])

    }
    else
    {
        res.status(403).send("Access denied.")
    }

})

app.post('/signUp', (req, res) => {

    user = auth(req)
    if(user)
    {   
        //---ADATBÁZIS INSERT (Sequelize?)---
        //INSERT INTO user VALUES(req.userName, req.password, req.emailAddress, 1)
        //const userId = SELECT userID FROM user WHERE req.userName = name AND req.password = password
        
            //SIKERES (.then)
            res.json([{
                status: 1, //Sikeres
                userId: userId 
            }])

            //SIKERTELEN (.catch)
            res.json([{
                status: 2, //Sikertelen
                userId: null
            }])

    }
    else
    {
        res.status(403).send("Access denied.")
    }

})

app.post('/forgotPassword', (req, res) => {

    user = auth(req)
    if(user)
    {        
        //---ADATBÁZIS SELECT (Sequelize?)---
        //const userId = SELECT userID FROM user WHERE req.emailAddress = emailAddress

            //SIKERES (.then)
            res.json([{
                status: 1, //Sikeres
            }])
        
            //SIKERTELEN (.catch)
            res.json([{
                status: 2, //Sikertelen
            }])

        //---ÚJ TEMP JELSZÓ LÉTREHOZÁSA (crypto)---
        const crypto = require('crypto')
        const newPass = crypto.randomBytes(5).toString('hex') //Létrehoz egy random 10 számból/hexa betűből álló temp 'jelszót'
        
        //---ADATBÁZIS UPDATE (Sequelize?)---
        //UPDATE user SET password = newPass WHERE userId = id

            //SIKERES (.then)
            res.json([{
                status: 1, //Sikeres
            }])

            //SIKERTELEN (.catch)
            res.json([{
                status: 2, //Sikertelen
            }])

        //---EMAIL KÜLDÉS (Nodemailer)--- 
        const mailer = require('nodemailer')
        const mailSender = mailer.createTransport(
            {
                service: 'gmail',
                auth: {
                    user: 'TournetBMEPasswordRecovery@gmail.com', //TODO: létrehozni
                    pass: 'tournetPass123'
                }
            })
        const content = {
            from: 'TournetBMEPasswordRecovery@gmail.com',
            to: req.emailAddress,
            subject: 'TournetBME - Jelszó helyreállítás',
            text: 'Az új jelszavad: ' + newPass + "\n\nKérjük, hogy a fiókod biztonsága érdekében a következő bejelentkezésnél állíts új jelszót a profilbeállításoknál!"
        };
        mailSender.sendMail(content, (err, data) => {
            if(err)
            {
                res.json([{
                    status: 2, //Sikertelen
                }])
            }
            else
            {
                res.json([{
                    status: 1, //Sikeres
                }])
            }
        })
    }
    else
    {
        res.status(403).send("Access denied.")
    }

})

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