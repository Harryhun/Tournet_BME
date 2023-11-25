const { Sequelize } = require('sequelize')
const databaseConn = new Sequelize('tournet', 'admin', 'pass', {
    host: 'localhost',
    dialect: 'mysql'
})

let fs = require('fs')
const auth = require('basic-auth')

let initModels = require("./models/init-models")
const placedomainconnector = require('./models/placedomainconnector')
const db = initModels(databaseConn)
db.rating.hasOne(db.place)
db.place.belongsTo(db.rating)
db.picture.hasOne(db.place)
db.place.belongsTo(db.picture)
db.picture.hasOne(db.domain)
db.domain.belongsTo(db.picture)
db.place.belongsToMany(db.domain, {through: db.placedomainconnector})
db.domain.belongsToMany(db.place, {through: db.placedomainconnector})
db.place.belongsToMany(db.user, {through: db.userplaceconnector})
db.user.belongsToMany(db.place, {through: db.userplaceconnector})
db.suggestion.belongsTo(db.user)
db.suggestion.belongsTo(db.domain)



module.exports = function() {
    this.login = async function login(req, res)
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
                if(queryRes == null)
                {
                    res.json({
                        status: 0 //Üres válasz
                    })
                }
                else
                {
                    res.json({
                        status: 1, //Sikeres
                        userId: queryRes.dataValues.id,
                        roleId: queryRes.dataValues.roleId
                    })
                }
            })
            .catch((err) =>
            {
                console.log(err)
                res.json({
                    status: 2 //Sikertelen
                })
            })
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }
    
    this.signUp = async function signUp(req, res)
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
                    res.json({
                        status: 1, //Sikeres
                        userId: queryRes.dataValues.id
                    })
                })
                .catch((err) =>
                {
                    res.json({
                        status: 2 //Sikertelen
                    })
                })
            })
            .catch((err) => {
                res.json({
                    status: 2 //Sikertelen
                })
            })
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }
    
    this.forgotPassword = async function forgotPassword(req, res)
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
                if(queryRes == null)
                {
                    res.json({
                        status: 0 //Üres válasz
                    })
                    return
                }
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
                            user: 'tournetbme@gmail.com',
                            pass: 'iatfnpnoenfmghoj' //!tournet123
                        }
                    })
                    const content = {
                        from: 'tournetbme@gmail.com',
                        to: req.body.emailAddress,
                        subject: 'TournetBME - Jelszó helyreállítás',
                        text: 'Az új jelszavad: ' + newPass + "\n\nKérjük, hogy a fiókod biztonsága érdekében a következő bejelentkezésnél állíts új jelszót a profilbeállításoknál!"
                    }
                    mailSender.sendMail(content, (err, data) => {
                        if(err)
                        {
                            res.json({
                                status: 2, //Sikertelen
                            })
                            console.log(err)
                        }
                        else
                        {
                            res.json({
                                status: 1 //Sikeres
                            })
                        }
                    })   
                }) 
                .catch((err) =>
                {
                    res.json({
                        status: 2 //Sikertelen
                    })
                })        
            })
            .catch((err) =>
            {
                res.json({
                    status: 2 //Sikertelen
                })
            })
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }
    
    this.requestDomains = async function requestDomains(req, res)
    {
        user = auth(req)
        if(user)
        {
            db.domain.findAll({
                include: [db.picture, { model: db.place, include: [db.rating] }]
            })
            .then(queryRes => {
                let sumRating = 0
                let rating = 0
                let divisor = 0
                let domainObjectList = new Array()
                for(let i = 0; i < queryRes.length; i++)
                {
                    sumRating = 0 
                    domainObjectList[i] = {}
                    domainObjectList[i]["id"] = queryRes[i].dataValues.id
                    domainObjectList[i]['name'] = queryRes[i].dataValues.name
                    for (let j = 0; j < queryRes[i].dataValues.places.length; j++) 
                    {
                        rating = 0
                        divisor = 0
                        if(queryRes[i].dataValues.places[j].rating.oneStar != 0)
                        {
                            divisor += queryRes[i].dataValues.places[j].rating.oneStar
                            rating += 1 * queryRes[i].dataValues.places[j].rating.oneStar
                        }
                        if(queryRes[i].dataValues.places[j].rating.twoStar != 0)
                        {
                            divisor += queryRes[i].dataValues.places[j].rating.twoStar
                            rating += 2 * queryRes[i].dataValues.places[j].rating.twoStar
                        }
                        if(queryRes[i].dataValues.places[j].rating.threeStar != 0)
                        {
                            divisor += queryRes[i].dataValues.places[j].rating.threeStar
                            rating += 3 * queryRes[i].dataValues.places[j].rating.threeStar
                        }
                        if(queryRes[i].dataValues.places[j].rating.fourStar != 0)
                        {
                            divisor += queryRes[i].dataValues.places[j].rating.fourStar
                            rating += 4 * queryRes[i].dataValues.places[j].rating.fourStar
                        }
                        if(queryRes[i].dataValues.places[j].rating.fiveStar != 0)
                        {
                            divisor += queryRes[i].dataValues.places[j].rating.fiveStar
                            rating += 5 * queryRes[i].dataValues.places[j].rating.fiveStar
                        }
                        if(divisor != 0)
                        {
                            rating /= divisor
                        }
                        sumRating += rating
                    }
                    domainObjectList[i]['rating'] = sumRating/queryRes[i].dataValues.places.length
                    domainObjectList[i]['picture'] = Buffer.from(fs.readFileSync('./images/domains/'+queryRes[i].dataValues.picture.source)).toString('base64')
                }
                res.json({
                    status: 1, //Sikeres
                    domains: domainObjectList 
                })
            })
            .catch((err) =>
            {
                res.json({
                    status: 2 //Sikertelen
                })
            })
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }
    
    this.requestPlaces = async function requestPlaces(req, res)
    {
        user = auth(req)
        if(user)
        {
            db.place.findAll({
                include: [db.rating, db.picture, {model: db.domain, where: {id: req.body.domainId}}],
            })
            .then(queryRes => {
                let placeObjectList = new Array()
                for(let i = 0; i < queryRes.length; i++)
                {
                    placeObjectList[i] = {}
                    placeObjectList[i]["id"] = queryRes[i].dataValues.id
                    placeObjectList[i]['name'] = queryRes[i].dataValues.name
                    placeObjectList[i]['rating'] = {}
                    placeObjectList[i]['rating']['oneStar'] = queryRes[i].dataValues.rating.oneStar
                    placeObjectList[i]['rating']['twoStar'] = queryRes[i].dataValues.rating.twoStar
                    placeObjectList[i]['rating']['threeStar'] = queryRes[i].dataValues.rating.threeStar
                    placeObjectList[i]['rating']['fourStar'] = queryRes[i].dataValues.rating.fourStar
                    placeObjectList[i]['rating']['fiveStar'] = queryRes[i].dataValues.rating.fiveStar
                    placeObjectList[i]['visitors'] = queryRes[i].dataValues.visitors
                    placeObjectList[i]['picture'] = Buffer.from(fs.readFileSync('./images/places/'+queryRes[i].dataValues.picture.source)).toString('base64')
                    placeObjectList[i]['description'] = queryRes[i].dataValues.description
                    placeObjectList[i]['website'] = queryRes[i].dataValues.website
                    placeObjectList[i]['price'] = queryRes[i].dataValues.price
                    placeObjectList[i]['latitude'] = queryRes[i].dataValues.latitude
                    placeObjectList[i]['longitude'] = queryRes[i].dataValues.longitude
                }
                res.json({
                    status: 1, //Sikeres
                    places: placeObjectList
                })
            })
            .catch((err) =>
            {
                res.json({
                    status: 2 //Sikertelen
                })
            })
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }
    
    this.recieveSuggestion = async function recieveSuggestion(req, res)
    {
        user = auth(req)
        if(user)
        {
            db.suggestion.create({
                domainId: req.body.domainId,
                userId: req.body.userId,
                suggestion: req.body.suggestionName,
            })
            .then(queryRes => {
                res.json({
                    status: 1 //Sikeres
                })
            })
            .catch((err) => {
                res.json({
                    status: 2 //Sikertelen
                })
            })
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }
    
    this.setVisited = async function setVisited(req, res)
    {
        user = auth(req)
        if(user)
        {
            db.userplaceconnector.findOne({
                where: {
                    userId: req.body.userId,
                    placeId: req.body.placeId
                }
            })
            .then(queryRes => {
                if(queryRes == null)
                {
                    db.userplaceconnector.create({
                        placeId: req.body.placeId,
                        userId: req.body.userId,
                        rating: 0
                    })
                    .then(queryRes2 => {
                        res.json({
                            status: 1 //Sikeres
                        })
                    })
                    .catch((err) =>
                    {
                        res.json({
                            status: 2 //Sikertelen
                        })
                    })
                }
                else
                {
                    queryRes.destroy()
                    .then(queryRes2 => {
                        res.json({
                            status: 1 //Sikeres
                        })
                    })
                    .catch((err) =>
                    {
                        res.json({
                            status: 2 //Sikertelen
                        })
                    })
                }
            })
            .catch((err) =>
            {
                res.json({
                    status: 2 //Sikertelen
                })
            })
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }
    
    this.setRating = async function setRating(req, res)
    {

        user = auth(req)
        if(user)
        {
            db.userplaceconnector.findOne({
                where: {
                    userId: req.body.userId,
                    placeId: req.body.placeId
                }
            })
            .then(queryRes => {
                if(queryRes == null)
                {
                    db.userplaceconnector.create({
                        placeId: req.body.placeId,
                        userId: req.body.userId,
                        rating: req.body.ratingValue
                    })
                    .then(queryRes2 => {
                        res.json({
                            status: 1 //Sikeres
                        })
                    })
                    .catch((err) =>
                    {
                        res.json({
                            status: 2 //Sikertelen
                        })
                    })
                }
                else
                {
                    db.userplaceconnector.update({rating: req.body.ratingValue}, {
                            where: {
                                placeId: req.body.placeId,
                                userId: req.body.userId,
                            }
                    })
                    .then(queryRes2 => {
                        res.json({
                            status: 1 //Sikeres
                        })
                    })
                    .catch((err) =>
                    {
                        res.json({
                            status: 2 //Sikertelen
                        })
                    })
                }
            })
            .catch((err) =>
            {
                res.json({
                    status: 2 //Sikertelen
                })
            })
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }
    
    this.profileUpdate = async function profileUpdate(req, res)
    {
        user = auth(req)
        if(user)
        {   
            switch(req.body.type)
            {
                default: break;
                case 0:

                db.user.update({name: req.body.newInfo}, {
                    where: {
                        id: req.body.userId,
                    }
                })
                .then(queryRes => {
                    res.json({
                        status: 1 //Sikeres
                })
                })
                .catch((err) =>
                {
                    res.json({
                        status: 2 //Sikertelen
                    })
                })

                break;
                case 1:

                db.user.update({password: req.body.newInfo}, {
                    where: {
                        id: req.body.userId,
                    }
                })
                .then(queryRes => {
                    res.json({
                        status: 1 //Sikeres
                })
                })
                .catch((err) =>
                {
                    res.json({
                        status: 2 //Sikertelen
                    })
                })

                break;
                case 2:

                db.user.update({email: req.body.newInfo}, {
                    where: {
                        id: req.body.userId,
                    }
                })
                .then(queryRes => {
                    res.json({
                        status: 1 //Sikeres
                    })
                })
                .catch((err) =>
                {
                    console.log(err)
                    res.json({
                        status: 2 //Sikertelen
                    })
                })

                break;
            }
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }
    
    this.requestUserData = async function requestUserData(req, res)
    {
        user = auth(req)
        if(user)
        {  
            db.user.findOne({
                where: {
                    id: req.body.userId
                }
            })
            .then((queryRes) => 
            {
                if(queryRes == null)
                {
                    res.json({
                        status: 0 //Üres válasz
                    })
                }
                else
                {
                    res.json({
                        status: 1, //Sikeres
                        userName: queryRes.dataValues.name,
                        password: queryRes.dataValues.password,
                        emailAddress: queryRes.dataValues.email
                    })
                }
            })
            .catch((err) =>
            {
                res.json({
                    status: 2 //Sikertelen
                })
            })
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }

    this.requestUserRating = async function requestUserRating(req, res)
    {
        user = auth(req)
        if(user)
        {  
            db.userplaceconnector.findOne({
                where: {
                    userId: req.body.userId,
                    placeId: req.body.placeId
                }
            })
            .then((queryRes) => 
            {
                if(queryRes == null)
                {
                    res.json({
                        status: 0 //Üres válasz
                    })
                }
                else
                {
                    res.json({
                        status: 1, //Sikeres
                        ratingValue: queryRes.dataValues.rating
                    })
                }
            })
            .catch((err) =>
            {
                res.json({
                    status: 2 //Sikertelen
                })
            })
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }

    this.requestRecommendedDomain = async function requestRecommendedDomain(req, res)
    {
        user = auth(req)
        if(user)
        {  
            db.domain.findOne({
                include: [db.picture, { model: db.place, include: [db.rating] }],
                where: {
                    id: 1
                }
            })
            .then((queryRes) => 
            {
                if(queryRes == null)
                {
                    res.json({
                        status: 0 //Üres válasz
                    })
                }
                else
                {
                    let sumRating = 0
                    let rating = 0
                    let divisor = 0
                    for (let j = 0; j < queryRes.dataValues.places.length; j++) 
                    {
                        rating = 0
                        divisor = 0
                        if(queryRes.dataValues.places[j].rating.oneStar != 0)
                        {
                            divisor += queryRes.dataValues.places[j].rating.oneStar
                            rating += 1 * queryRes.dataValues.places[j].rating.oneStar
                        }
                        if(queryRes.dataValues.places[j].rating.twoStar != 0)
                        {
                            divisor += queryRes.dataValues.places[j].rating.twoStar
                            rating += 2 * queryRes.dataValues.places[j].rating.twoStar
                        }
                        if(queryRes.dataValues.places[j].rating.threeStar != 0)
                        {
                            divisor += queryRes.dataValues.places[j].rating.threeStar
                            rating += 3 * queryRes.dataValues.places[j].rating.threeStar
                        }
                        if(queryRes.dataValues.places[j].rating.fourStar != 0)
                        {
                            divisor += queryRes.dataValues.places[j].rating.fourStar
                            rating += 4 * queryRes.dataValues.places[j].rating.fourStar
                        }
                        if(queryRes.dataValues.places[j].rating.fiveStar != 0)
                        {
                            divisor += queryRes.dataValues.places[j].rating.fiveStar
                            rating += 5 * queryRes.dataValues.places[j].rating.fiveStar
                        }
                        if(divisor != 0)
                        {
                            rating /= divisor
                        }
                        sumRating += rating
                    }
                    res.json({
                        status: 1, //Sikeres
                        domainId: queryRes.dataValues.id,
                        name: queryRes.dataValues.name,
                        rating: sumRating/queryRes.dataValues.places.length,
                        picture: Buffer.from(fs.readFileSync('./images/places/'+queryRes.dataValues.picture.source)).toString('base64')
                    })
                }
            })
            .catch((err) =>
            {
                console.log(err)
                res.json({
                    status: 2 //Sikertelen
                })
            })
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }

    this.addPlace = async function addPlace(req, res)
    {
        user = auth(req)
        if(user)
        {
            db.rating.create({
                oneStar: 0,
                twoStar: 0,
                threeStar: 0,
                fourStar: 0,
                fiveStar: 0
            })
            .then(newRating => {
                db.picture.create({
                    source: req.body.picture
                })
                .then(newPicture =>{
                    db.place.create({
                        name: req.body.name,
                        ratingId: newRating.dataValues.id,
                        visitors: 0,
                        pictureId: newPicture.dataValues.id,
                        description: req.body.description,
                        website: req.body.website,
                        price: req.body.price,
                        latitude: req.body.latitude,
                        longitude: req.body.longitude
                    })
                    .then(newPlace => {
                        db.placedomainconnector.create({
                            domainId: req.body.domainId,
                            placeId: newPlace.dataValues.id
                        })
                        .then(queryRes => {
                            res.json({
                                status: 1, //Sikeres
                            })
                        })
                        .catch((err) =>
                        {
                            res.json({
                                status: 2 //Sikertelen
                            })
                        })
                    })
                    .catch((err) =>
                    {
                        console.log(err)
                        res.json({
                            status: 2 //Sikertelen
                        })
                    })
                })
                .catch((err) =>
                {
                    res.json({
                        status: 2 //Sikertelen
                    })
                })
            })
            .catch((err) =>
            {
                res.json({
                    status: 2 //Sikertelen
                })
            })
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }

    this.editPlace = async function editPlace(req, res)
    {
        user = auth(req)
        if(user)
        {  
            db.place.update({
                name: req.body.name,
                description: req.body.description,
                website: req.body.website,
                price: req.body.price,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
            }, {
                where: {
                    id: req.body.id,
                }
            })
            .then(queryRes => {
                res.json({
                    status: 1 //Sikeres
                })
            })
            .catch((err) =>
            {
                console.log(err)
                res.json({
                    status: 2 //Sikertelen
                })
            })
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }

    this.deletePlace = async function deletePlace(req, res)
    {
        user = auth(req)
        if(user)
        {
            db.place.findOne({
                where: {
                    id: req.body.id
                }
            })
            .then((placeRes) => 
            {
                if(placeRes == null)
                {
                    res.json({
                        status: 0 //Üres válasz
                    })
                }
                else
                {
                    db.placedomainconnector.destroy({
                        where: {
                            placeId: placeRes.dataValues.id
                        }
                    })
                    .then(queryRes => {
                        db.place.destroy({
                            where: {
                                id: req.body.id
                            }
                        })
                        .then(queryRes2 => {
                            db.rating.destroy({
                                where: {
                                    id: placeRes.dataValues.ratingId
                                }
                            })
                            .then(queryRes3 => {
                                db.picture.destroy({
                                    where: {
                                        id: placeRes.dataValues.pictureId
                                    }
                                })
                                .then(queryRes => {
                                    res.json({
                                        status: 1 //Sikertelen
                                    })
                                })
                                .catch((err) =>
                                {
                                    res.json({
                                        status: 2 //Sikertelen
                                    })
                                })
                            })
                            .catch((err) =>
                            {
                                res.json({
                                    status: 2 //Sikertelen
                                })
                            })
                        })
                        .catch((err) =>
                        {
                            res.json({
                                status: 2 //Sikertelen
                            })
                        })
                    })
                    .catch((err) =>
                    {
                        res.json({
                            status: 2 //Sikertelen
                        })
                    })
                }
            })
            .catch((err) =>
            {
                console.log(err)
                res.json({
                    status: 2 //Sikertelen
                })
            })
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }

    this.requestSuggestions = async function requestSuggestions(req, res)
    {
        user = auth(req)
        if(user)
        {  
            db.suggestion.findAll({
                include: [db.domain, db.user]
            })
            .then(queryRes => {
                let suggestionObjectList = new Array()
                for(let i = 0; i < queryRes.length; i++)
                {
                    suggestionObjectList[i] = {}
                    suggestionObjectList[i]['id'] = queryRes[i].dataValues.id
                    suggestionObjectList[i]['domain'] = queryRes[i].dataValues.domain.name
                    suggestionObjectList[i]['user'] = queryRes[i].dataValues.user.name
                    suggestionObjectList[i]['suggestion'] = queryRes[i].dataValues.suggestion
                }
                res.json({
                    status: 1, //Sikeres
                    suggestions: suggestionObjectList
                })
            })
            .catch((err) =>
            {
                res.json({
                    status: 2 //Sikertelen
                })
            })
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }

    this.deleteSuggestions = async function deleteSuggestions(req, res)
    {
        user = auth(req)
        if(user)
        {  
            db.suggestion.destroy({
                where: {
                    id: req.body.suggestionId
                }
            })
            .then(queryRes => {
                res.json({
                    status: 1, //Sikeres
                })
            })
            .catch((err) =>
            {
                res.json({
                    status: 2 //Sikertelen
                })
            })
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }

    this.requestUsers = async function requestUsers(req, res)
    {
        user = auth(req)
        if(user)
        {  
            db.user.findAll()
            .then(queryRes => {
                let userObjectList = new Array()
                for(let i = 0; i < queryRes.length; i++)
                {
                    userObjectList[i] = {}
                    userObjectList[i]['name'] = queryRes[i].dataValues.name
                    userObjectList[i]['password'] = queryRes[i].dataValues.password
                    userObjectList[i]['email'] = queryRes[i].dataValues.email
                    userObjectList[i]['roleId'] = queryRes[i].dataValues.roleId
                }
                res.json({
                    status: 1, //Sikeres
                    users: userObjectList
                })
            })
            .catch((err) =>
            {
                res.json({
                    status: 2 //Sikertelen
                })
            })
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }

    this.setUserRole = async function setUserRole(req, res)
    {
        user = auth(req)
        if(user)
        {  
            db.user.update({roleId: req.body.newRoleId}, {
                where: {
                    id: req.body.userId,
                }
            })
            .then(queryRes => {
                res.json({
                    status: 1 //Sikeres
            })
            })
            .catch((err) =>
            {
                res.json({
                    status: 2 //Sikertelen
                })
            })
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }

}